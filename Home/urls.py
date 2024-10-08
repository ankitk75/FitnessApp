from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.home_view, name='home'),
    path('home/ajax', views.home_ajax_view, name='home_ajax'),

    path('progress/', views.progress_view, name='progress'),
    path('progress/add', views.progress_add_view, name='progress_add'),
    path('progress/ajax', views.progress_ajax_view, name='progress_ajax'),

    path('nutrition/', views.nutrition_view, name='nutrition'),
    path('nutrition/autocomplete', views.autocomplete, name='autocomplete'),
    path('nutrition/search_product', views.search_product, name='search_product'),
    path('nutrition/add_product_to_db', views.add_product_to_db, name='add_product_to_db'),
    path('nutrition/add_product_to_user', views.add_product_to_user, name='add_product_to_user'),

    path('activity/', views.activity_view, name='activity'),
    path('activity/add_activity_to_user', views.add_activity_to_user, name="add_activity_to_user"),

    path('training/', views.training_view, name='training'),

    path('social/', views.social_view, name='social'),
    path('social/add/', views.social_add_view, name='social_add'),
    path('social/update/', views.social_update_ajax_view, name='social_update'),
    path('social/delete/<str:id>', views.social_delete_view, name='social_delete'),
    
    path('parameters/', views.parameters_view, name='parameters'),
]
