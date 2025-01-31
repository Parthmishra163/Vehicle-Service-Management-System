from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, DateTimeField
from django.db.models.functions import TruncMonth, TruncYear, TruncDay
from rest_framework.decorators import action
from .models import Component, Vehicle, Issue, Payment
from .serializers import ComponentSerializer, VehicleSerializer, IssueSerializer, PaymentSerializer

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

# service/views.py
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    # Add this custom action
    @action(detail=True, methods=['get'])
    def calculate_total(self, request, pk=None):
        try:
            issue = self.get_object()
            components = issue.components.all()
            
            component_total = sum(
                float(comp.new_price) if issue.use_new_components else float(comp.repair_price)
                for comp in components
            )
            labor_cost = 100.00
            total = component_total + labor_cost
            
            return Response({'total': round(total, 2)})
        
        except Issue.DoesNotExist:
            return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        issue = self.get_object()
        payment_amount = issue.total_price
        
        Payment.objects.create(issue=issue, amount=payment_amount)
        issue.payment_status = True
        issue.save()
        
        return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
 
 # views.py
# class IssueCreateAPIView(CreateAPIView):
#     queryset = Issue.objects.all()
#     serializer_class = IssueSerializer

#     def perform_create(self, serializer):
#         instance = serializer.save()
#         # Calculate and save total price during creation
#         total = instance.calculate_total()
#         instance.total_price = total
#         instance.save()   

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    @action(detail=False, methods=['get'])
    def revenue(self, request):
        # Get the time frame from query params (defaults to 'daily')
        time_frame = request.query_params.get('timeFrame', 'daily')
        
        # Define the truncation function based on the selected time frame
        trunc_function = {
            'daily': TruncDay,
            'monthly': TruncMonth,
            'yearly': TruncYear
        }.get(time_frame, TruncDay)  # Default to 'daily' if invalid timeframe

        # Aggregate payments by the selected period
        revenue_data = Payment.objects.annotate(
            period=trunc_function('payment_date')
        ).values('period').annotate(
            total_revenue=Sum('amount')
        ).order_by('period')

        # Return the aggregated data as JSON to the frontend
        return Response(revenue_data)