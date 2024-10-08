from django.test import TestCase
from .models import Food
import json

class FoodTestCase(TestCase):

    @staticmethod    
    def setUp():
        with open('data.json', 'r') as f:
            foods = json.load(f)
        
        for name, facts in foods.items():
            food = Food(name=name, energy=facts['Energy'], lipid=facts['Lipid'], carbohydrate=facts['Carbohydrate'],
                    sugar=facts["Sugar"], protein=facts['Protein'], fiber=facts['Fiber'], water=facts['Water'], label=Food.FoodLabel.INGR)
            food.save()
        
    

FoodTestCase.setUp()
