from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, Cart, CartItem
from rest_framework.permissions import IsAuthenticated
from .serializers import ProductSerializer, CartSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class CartDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                cart_item.quantity += quantity
            cart_item.save()
            return Response({'message': 'Producto añadido a la cesta con éxito'})
        except Product.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=404)


class CartClearView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            # Obtener todos los artículos de la cesta del usuario
            cart_items = CartItem.objects.filter(user=user)

            # Eliminar todos los artículos de la cesta del usuario
            cart_items.delete()

            return Response({"message": "Cesta vaciada con éxito"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)