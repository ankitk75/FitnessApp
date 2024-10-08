from django.shortcuts import (
    render, redirect,
)
from django.contrib.auth import (
    authenticate, login, logout,
)
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import (
    Result, Account, Activity, SocialPost, LikedPost, DislikedPost, Meal, Food
)
from Home.functions import (
    get_signup_form_fields, check_form_fields, create_account_using_form,
    get_nutrition_calories_of_day, get_activity_calories_of_day,
)
import datetime as dt
from . import helpers
import json


# Create your views here.

def login_view(request):
    """ Login page, check for user login. """
    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            user = User.objects.get(username=username)
        except:
            print(f"[ERROR] login : user '{username}' does not exist")
            messages.error(request, "The user does not exist. Try again.")
        user = authenticate(request, username=username, password=password)
        if user is None:
            messages.error(request, "User Name or Password is incorrect.")
        else:
            login(request, user)
            return redirect('home')

    return render(request, 'login.html')


def signup_view(request):
    """ Signup page, create a user. """
    gender = {
        "Male": Account.Gender.MALE,
        "Female": Account.Gender.FEMALE,
    }
    lifestyles = {
        "No activity": Account.LifeStyle.ACTIVE_NONE,
        "Not very active": Account.LifeStyle.ACTIVE_LOW,
        "Moderately active": Account.LifeStyle.ACTIVE_MED,
        "Very active": Account.LifeStyle.ACTIVE_INT,
        "Professional": Account.LifeStyle.ACTIVE_PRO,
    }
    goals = {
        "Gain muscle": Account.GoalType.GAIN_WEIGHT,
        "Maintain your weight": Account.GoalType.MAINTAIN_WEIGHT,
        "Lose weight": Account.GoalType.LOSE_WEIGHT,
    }
    context = {"gender": gender, "lifestyles": lifestyles, "goals": goals}

    if request.method == 'POST':
        form = get_signup_form_fields(request)
        check = check_form_fields(form)
        if check:


            if User.objects.filter(username=form.get('username'), email=form.get('email')).exists():
                print(f"[ERROR] signup : user '{form.get('username')}' already exists")
                messages.error(request, "The user already exists, account creation not possible.")
            # Creating a new user in the database
            else:
                account = create_account_using_form(form)
                account.save()
                print(f"[SUCCESS] signup : user '{form.get('username')}' was created")
                messages.success(request, "Your account has been created successfully!")
                return render(request, 'index.html')
        else:
            print("[ERROR] signup : invalid form fields")
            messages.error(request, "Some fields are invalid or empty, please enter valid information.")

    return render(request, 'signup.html', context)


@login_required(login_url='/')
def logout_view(request):
    """ Logout user and redirect to index page. """
    logout(request)
    return redirect('/')


def index_view(request):
    """ Index page. """
    return render(request, 'index.html')


@login_required(login_url='/login/')
def home_view(request):
    """ User home page. """
    context = {}

    if request.method == 'GET':
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)

        try:
            result_of_day = Result.objects.get(date=dt.date.today(), owner=account)
            # (Meal)
            day_food_calories = get_nutrition_calories_of_day(result_of_day)
            # (Activity)
            day_activity_calories = get_activity_calories_of_day(result_of_day)
            # Moyenne de calories journalieres des 15 derniers jours
            average_calories = 0
            day_count = 0
            date_15days_back = (dt.datetime.today() - dt.timedelta(days=15)).strftime("%Y-%m-%d")
            last_15_results = Result.objects.filter(date__gte=date_15days_back, owner=account).reverse()
            for result in last_15_results:
                nutrition_calories = get_nutrition_calories_of_day(result)
                average_calories += nutrition_calories
                day_count += 1
            if day_count != 0:
                average_calories /= day_count

            context = {
                "goal_calories": account.goalCalories,
                "day_food_calories": round(day_food_calories),
                "day_activity_calories": round(day_activity_calories),
                "average_calories": round(average_calories),
            }
        except:
            context = {
                "goal_calories": account.goalCalories,
                "day_food_calories": 0,
                "day_activity_calories": 0,
                "average_calories": 0,
            }
    
    return render(request, 'home.html', context)


@csrf_exempt
@login_required(login_url='/login/')
def home_ajax_view(request):
    if request.method == 'POST':
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        response = request.POST.copy()
        dates = []
        calories = []
        for i in range (0, 15):
            dates.append((dt.datetime.today() - dt.timedelta(days=i)).strftime("%d/%m"))
            try:
                result = Result.objects.get(date=(dt.datetime.today() - dt.timedelta(days=i)).strftime("%Y-%m-%d"), owner=account)
                calories.append(get_nutrition_calories_of_day(result))
            except:
                calories.append(0)
        dates.reverse()
        calories.reverse()        
        response["dates"] = dates
        response["calories"] = calories

        return JsonResponse(response)


@login_required(login_url='/login/')
def progress_view(request):
    """ User progress page. """
    return render(request, 'progress.html')


@login_required(login_url='/login/')
def progress_add_view(request):
    """ User progress page. """
    context = {}
    if request.method == "POST":
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        new_weight = int(request.POST.get("weight"))

        try:
            # Modification du poids dans les resultats du jour
            result_of_day = Result.objects.get(date=dt.date.today(), owner=account)
            result_of_day.weight = new_weight
            result_of_day.save()
            if new_weight >= account.goalWeight:
                account.goalType = "L"
            else:
                account.goalType = "W"
            account.weight = new_weight
            account.set_goal_calories()
            account.save()
        except:
            # Creation d'un resultat du jour.
            new_result = Result.objects.create(weight=new_weight, owner=account)
            account.weight = new_weight
            account.set_goal_calories()
            account.save()

    return render(request, 'progress.html', context)


@csrf_exempt
@login_required(login_url='/login/')
def progress_ajax_view(request):
    """ User progress page. """
    response = {}
    
    if request.method == 'POST':
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        response = request.POST.copy()
        response["goal_weights"] = [account.goalWeight for i in range(0, 15)]
        response["height"] = account.height

        # Recuperer les max 15 derniers poids enregistrees du compte
        results = Result.objects.filter(owner=account)[:15]
        dates = []
        weights = []
        # Si pas d'enregistrement, prendre le poids à la creation du compte
        if len(results) == 0:
            for i in range(0, 14):
                dates.append(" ")
                weights.append(" ")
            dates.append(str(current_user.date_joined.date()))
            weights.append(str(account.weight))
        # Prendre les enregistrements
        else:
            for i in range(0, 15-len(results)):
                dates.append(" ")
                weights.append(" ")
            for res in results:
                dates.append(str(res.date))
                weights.append(str(res.weight))
        dates.reverse()
        weights.reverse()
        response["dates"] = dates
        response["weights"] = weights

    return JsonResponse(response)


@login_required(login_url='/login/')
def nutrition_view(request):
    """ User daily nutrition entries page. """
    context = helpers.get_calories_of_the_day(request)
    account = Account.objects.get(user=request.user)
    context.update({"calories_goal": account.goalCalories})
    return render(request, 'nutrition.html', context)


@login_required(login_url='/login/')
def activity_view(request):
    """ User daily activity entries page. """
    user = User.objects.get(id=request.user.id)
    context = helpers.get_activities_of_the_week(user)
    return render(request, 'activity.html', context)


@login_required(login_url='/login/')
def training_view(request):
    """ Training guides page. """
    return render(request, 'training.html')


@login_required(login_url='/login/')
def social_view(request):
    """ Social page with social posts. """
    posts = SocialPost.objects.all()
    current_user = User.objects.get(id=request.user.id)
    account = Account.objects.get(user=current_user)
    liked_posts = [lp.post.id for lp in LikedPost.objects.filter(liker=account)]
    disliked_posts = [dp.post.id for dp in DislikedPost.objects.filter(disliker=account)]
    context = {"account": account, "posts": posts, "liked": liked_posts, "disliked": disliked_posts}
    return render(request, 'social.html', context)


@login_required(login_url='/login/')
def social_add_view(request):
    """ Add a social post. """
    if request.method == "POST":
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        newPost = SocialPost.objects.create(
            author=account,
            text=request.POST.get('message'),
            likes=0,
            dislikes=0,
        )
        newPost.save()
    return redirect('/social')


@csrf_exempt
@login_required(login_url='/login/')
def social_update_ajax_view(request):
    response = {}
    if request.method == "POST":
        # Recuperation de la requete ajax
        ajax_request = {key: int(value) for (key, value) in request.POST.items()}
        # Recuperer en BDD les objets concernes
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        postId = ajax_request.get("post_id")
        socialPost = SocialPost.objects.get(id=postId)

        # Faire les modifications sur la base de donnees
        likes = ajax_request.get("likes")
        dislikes = ajax_request.get("dislikes")
        
        # Si le post a ete like, ajout a la table LikedPost
        if likes > socialPost.likes:
            socialPost.likes += 1
            to_add = LikedPost.objects.create(
                liker=account,
                post=socialPost
            )
            to_add.save()
            socialPost.save()
        # Si le post n'est plus like, supression de la table LikedPost
        if likes < socialPost.likes:
            socialPost.likes -= 1
            to_rem = LikedPost.objects.get(liker=account, post=socialPost)
            to_rem.delete()
            socialPost.save()
        
        # Si le post a ete dislike, ajout a la table DislikedPost
        if dislikes > socialPost.dislikes:
            socialPost.dislikes += 1
            to_add = DislikedPost.objects.create(
                disliker=account,
                post=socialPost
            )
            to_add.save()
            socialPost.save()
        # Si le post n'est plus dislike, suppression de la table DislikedPost
        if dislikes < socialPost.dislikes:
            socialPost.dislikes -= 1
            to_rem = DislikedPost.objects.get(disliker=account, post=socialPost)
            to_rem.delete()
            socialPost.save()
        
    return JsonResponse(response)


@login_required(login_url='/login/')
def social_delete_view(request, id):
    """ Delete a specific social post. """
    post = SocialPost.objects.get(id=id)

    if request.method == "POST":
        post.delete()
        return redirect('/social')

    context = {"post": post}
    return render(request, 'social_delete.html', context)


@login_required(login_url='/login/')
def parameters_view(request):
    """ User parameters page. """
    context = {}
    if (request.user != User.objects.get(username='admin')):
        current_user = User.objects.get(id=request.user.id)
        account = Account.objects.get(user=current_user)
        age = account.get_age()
        context = {"account": account, "age": age}
    return render(request, 'parameters.html', context)


@csrf_exempt
def autocomplete(request):
    if request.method == "POST":
        pattern = request.POST.get('product')
        products = helpers.autocomplete_products(pattern)
        return JsonResponse({"products": products}, status=200, safe=False)
    return JsonResponse({"error": ""}, status=400, safe=False)


@csrf_exempt
def search_product(request):
    if request.method == "POST":
        product = request.POST.get('product')
        product_index = int(request.POST.get('product-index'))
        product_data = helpers.search_product(product, product_index)
        return JsonResponse(product_data, status=200, safe=False)
    return JsonResponse({"error": ""}, status=400, safe=False)


@csrf_exempt
def add_product_to_db(request):
    if request.method == "POST":
        data = request.POST
        helpers.add_product_to_db(data)
        return JsonResponse({"success": "Product added"}, status=200, safe=False)
    return JsonResponse({"error": ""}, status=400, safe=False)


@csrf_exempt
def add_product_to_user(request):
    if request.method == "POST":
        data = request.POST
        user = User.objects.get(id=request.user.id)
        helpers.add_product_to_user(user, data)
        context = helpers.get_calories_of_the_day(request)
        return JsonResponse(context, status=200, safe=False)
    return JsonResponse({"error": ""}, status=400, safe=False)


@csrf_exempt
def add_activity_to_user(request):
    if request.method == "POST":
        data = request.POST
        user = User.objects.get(id=request.user.id)
        helpers.add_activity_to_user(user, data)
        context = helpers.get_activities_of_the_week(user)
        return JsonResponse(context, status=200, safe=False)
    return JsonResponse({"error": ""}, status=400, safe=False)
