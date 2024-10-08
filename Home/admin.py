from django.contrib import admin
from .models import (
    Result, Account, Food, Activity ,SocialPost, LikedPost, DislikedPost, Meal,
)

# Register your models here.

admin.site.register(Account)
admin.site.register(Result)
admin.site.register(Food)
admin.site.register(Activity)
admin.site.register(SocialPost)
admin.site.register(LikedPost)
admin.site.register(DislikedPost)
admin.site.register(Meal)