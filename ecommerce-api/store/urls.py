from django.urls import path
from .views import ProductListView, CartDetailView, CartClearView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('api/cart/clear/', CartClearView.as_view(), name='cart-clear'),
]