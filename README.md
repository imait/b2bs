# b2bs

## about event file

* attribute
* *keyword*

### event types

* text
* options
* get_event
* lost_event
* catalyst
* check

#### type text

* next
* text

#### type options

* options
    * label
    * next

#### type get_event

* next
* item_type
* item_id

#### type lost_event

* next
* item_type
* item_id

#### type catalyst

* next
* action
    * *open*
        * item_id
        * function
            * *replace*
                * person
                * target
                * goto
            * *copy*
                * self
                * person
                * target
                * goto
    * *close*
        * item_id

#### type check

* object
    * *item*
    * *catalyst*
	* *stamina*
		* person
	* *skill*
		* person
	* *luck*
		* person
	* *love*
		* person
		* target
	* *hate*
		* person
		* target
* method
    * *has*
	* *equal*
	* *over*
	* *lower*
* goto
* else
