from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from datetime import timedelta, date


class Account(models.Model):
    """ User's account. """
    class Gender(models.TextChoices):
        MALE = 'M'
        FEMALE = 'F'

    class LifeStyle(models.TextChoices):
        ACTIVE_NONE = 'ANO', _('No activity')
        ACTIVE_LOW = 'ALOW', _('Low activity')
        ACTIVE_MED = 'AMED', _('Medium activity')
        ACTIVE_INT = 'AINT', _('Intense activity')
        ACTIVE_PRO = 'APRO', _('Professional activity')

    class GoalType(models.TextChoices):
        GAIN_WEIGHT = 'G', _('Gain Weight')
        MAINTAIN_WEIGHT = 'M', _('Maintain Weight')
        LOSE_WEIGHT = 'L', _('Lose Weight')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birthdate = models.DateField(validators=[MinValueValidator(
        timezone.now().date() - timedelta(days=365*100))])
    gender = models.CharField(max_length=1, choices=Gender.choices)
    weight = models.FloatField(validators=[MinValueValidator(20.0)])
    height = models.FloatField(validators=[MinValueValidator(20.0)])
    lifestyle = models.CharField(max_length=4, choices=LifeStyle.choices)
    goalType = models.CharField(max_length=1, choices=GoalType.choices)
    goalWeight = models.FloatField(validators=[MinValueValidator(20.0)])
    goalCalories = models.PositiveSmallIntegerField(blank=True, null=True)

    def __str__(self):
        return self.user.username

    def get_age(self):
        today = date.today()
        age = today.year - self.birthdate.year - ((today.month, today.day) < (self.birthdate.month, self.birthdate.day))
        return age
    
    def set_goal_calories(self):
        age = self.get_age()
        baseMetabolism = (10*float(self.weight)) + (6.25*float(self.height)) - (5*float(age))
        if self.gender == "M":
            baseMetabolism += 5.0
        elif self.gender == "F":
            baseMetabolism -= 161.0
        activity = { 'ANO': 1.2, 'ALOW': 1.375, 'AMED': 1.55, 'AINT': 1.725, 'APRO': 1.9 }
        self.goalCalories = baseMetabolism * activity.get(self.lifestyle, 1.2)
        if self.goalType == "G":
            self.goalCalories = self.goalCalories * 1.15
        elif self.goalType == "L":
            self.goalCalories = self.goalCalories * 0.85
        self.goalCalories = round(self.goalCalories)


class Result(models.Model):
    class Meta:
        ordering = ['-date']

    date = models.DateField(auto_now_add=True)
    sleep = models.TimeField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    waterCups = models.FloatField(default=0)
    steps = models.PositiveSmallIntegerField(default=0)
    owner = models.ForeignKey(Account, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return f"{self.date} of {self.owner}"
    

class Activity(models.Model):
    """ Activity data. """
    class ActivityType(models.TextChoices):
        YOGA = 'YOGA', _('Yoga')
        SWIMMING = 'SWIM', _('Swimming')
        CYCLING = 'CYCL', _('Cycling')
        SPINNING = 'SPIN', _('Running')
        LIFT_WEIGHT = 'LWGT', _('Lift Weight')
        CROSS_COUNTRY_SKIING = 'CCSK', _('Cross Country Skiing')
        HIGH_INTENSITY_INTERVAL_TRAINING = 'HIIT', _('High-intensity interval training')

    result = models.ForeignKey(Result, on_delete=models.CASCADE, default=None)
    activity = models.CharField(max_length=4, choices=ActivityType.choices)
    duration = models.DurationField()
    calories_burned_per_hour = {
        choice[1]: (400, 425, 525, 700, 425, 600, 900)[i]
        for i, choice in enumerate(ActivityType.choices)
    }

    def __str__(self) -> str:
        return self.activity

    def get_calories(self):
        return self.calories_burned_per_hour[self.activity] * (self.duration.total_seconds() / 3600)


class Meal(models.Model):

    class MealType(models.TextChoices):
        BREAKFAST = 'BRKF', _('Breakfast')
        MORNING_SNACK = 'MNSN', _('Morning Snack')
        LUNCH = 'LNCH', _('Lunch')
        SNACK = 'SNCK', _('Snack')
        DINNER = 'DNNR', _('Dinner')
    
    mealType = models.CharField(max_length=4, choices=MealType.choices)
    result = models.ForeignKey(Result, on_delete=models.CASCADE, null=True)


class Food(models.Model):
    class FoodLabel(models.TextChoices):
        MEAL = 'MEAL', _('Meal')
        INGR = 'INGR', _('Ingredient')

    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50)
    energy = models.FloatField()
    lipid = models.FloatField()
    carbohydrate = models.FloatField()
    sugar = models.FloatField()
    protein = models.FloatField()
    fiber = models.FloatField()
    water = models.FloatField()
    label = models.CharField(max_length=4, choices=FoodLabel.choices)

    def __str__(self):
        return f"{self.label}, {self.name}"


class SocialPost(models.Model):
    class Meta:
        ordering = ['-created']

    author = models.ForeignKey(Account, on_delete=models.CASCADE, default=None)
    text = models.TextField(blank=True, null=True)
    likes = models.PositiveSmallIntegerField(default=0)
    dislikes = models.PositiveSmallIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.created} from {self.author.user.username}"
    

class LikedPost(models.Model):
    liker = models.ForeignKey(Account, on_delete=models.CASCADE)
    post = models.ForeignKey(SocialPost, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.liker} liked {self.post.pk}"

class DislikedPost(models.Model):
    disliker = models.ForeignKey(Account, on_delete=models.CASCADE)
    post = models.ForeignKey(SocialPost, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.disliker} liked {self.post.pk}"
