from django.db import models

class Component(models.Model):
    name = models.CharField(max_length=100)
    repair_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    VIN = models.CharField(max_length=17, unique=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    issue_description = models.TextField()

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

class Issue(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    components = models.ManyToManyField(Component)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    use_new_components = models.BooleanField(default=False) 

    # Remove the custom save method

# service/models.py
class Payment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment #{self.id}"