MongoDB : Structure
=================

Article
-------
	
	* title : String
	* articleID : String
	* [ components : Component ]
	* abstract : String (160- chars)
	* content : String (markdown)
	* [ langages : Langages ]
	* created : Date
	* [ files : 
	  - path : String 
	  - description : String ]
	* by : User
	* [ edited : User ] 

Supplier
--------

	* name : String
	* suplierID : String
	* serial : String (10- chars)
	* country : Country
	* adress : String
	* city : String
	* score : Number
	* [ components : 
	  - component : Component
	  - price : Number ]


Country _Should store?_
--------

	* name : String (China)
	* serial : String (ZH)
	* [ suppliers : Supplier ]


Component
---------

	* name : String (ex : Bluetooth slave)
	* componentID : String
	* reference : String (ex : HC-06 )
	* [ suppliers : Supplier ]
	* [ categories : Category ]
	* [ images : String ]

Category
----------

	* categoryID: String
	* name : String
	* description : String
	* [ component : Component ]
