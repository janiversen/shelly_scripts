The I4 standard:

    +---+---+
    | 3 | 2 |
    +---+---+
    | 1 | 0 |
    +---+---+


Salon entrada y dormitorio:

+-------+-----------+     +----------------+------------------+
|  Luz  | Persianas |     | Luz intensidad | Persianas cerrar |
+-------+-----------+     +----------------+------------------+
|  Apagar todo luz  |     |         Apagar todo Luz           |
+-------+-----------+     +----------------+------------------+

Events entrada:    0 - 1 - 2 - 3
Events dormitorio: 1 - 0 - 3 - 2



Dormitorio entrada:

+------------+-----------+     +----------------+------------------+
|  Luz       | Persianas |     | Luz intensidad | Persianas cerrar |
+------------+-----------+     +----------------+------------------+
| Ventilador | Cama jan  |     |  Apagar todo Luz dormitorio/Baño  |
+------------+-----------+     +----------------+------------------+

Events entrada:    0 - 1 - 2 - 3
Events cama belen: 2 - 3 - 0 - 1
Events cama jan:   1 - 0 - 3 - 2
