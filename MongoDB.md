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
	* [ files : 
	  - title : String
	  - path : String 
	  - description : String ]
	* created : Human
	* [ edited : Human ] 

Supplier
--------

	* name : String
	* suplierID : String
	* country : String
	* adress : String
	* city : String
	* score : Number
	* [ components : 
	  - component : Component
	  - price : Number ]

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
