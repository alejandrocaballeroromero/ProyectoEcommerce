from django.contrib import admin
from .models import Product, Cart, CartItem

# Registrar el modelo Product para el admin de Django
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock')  # Campos visibles en la lista de productos
    search_fields = ('name',)  # Campos de búsqueda disponibles

# Registrar los modelos relacionados con la Cesta
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    search_fields = ('cart__user__username', 'product__name')
