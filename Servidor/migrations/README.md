# Compra simulada y entrega automática

1. Abre el SQL Editor del proyecto Supabase.
2. Ejecuta una vez `20261117_compra_simulada_y_entrega.sql`.
3. Reinicia el servidor Express y el cliente Vite.

El SQL crea las funciones RPC `create_demo_order`, `get_my_demo_order` y
`get_my_purchased_keys`. La orden, el pago `simulated/approved`, sus artículos y
la actualización de inventario se confirman dentro de la misma transacción.
Las funciones solo son ejecutables por usuarios autenticados y las consultas de
orden y keys filtran por `auth.uid()`.

No se integra una pasarela ni se reciben datos bancarios. Los registros de
`key_inventory.key_ciphertext` sin prefijo se tratan como keys de texto para
este proyecto académico. También se admite el formato cifrado
`enc:v1:<iv-base64>:<tag-base64>:<ciphertext-base64>` con AES-256-GCM; para ese
formato configura `KEY_ENCRYPTION_KEY` en `Servidor/.env` como 64 caracteres
hexadecimales o como una clave Base64 de 32 bytes. No publiques esa clave.

Para probar una compra, inicia sesión, agrega una oferta publicada al carrito y
presiona **Finalizar compra simulada**. La oferta debe tener una fila de
inventario disponible por cada unidad solicitada. La orden completada aparecerá
en `orders`; las keys cambian a `sold` y quedan enlazadas al artículo en
`order_item_id`.
