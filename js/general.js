Array.implement({    
    combine: function(){
        var all = [],
            len = this.length,
            i, j;
            
        var combine = function(index, src, got){
            if(index == 0){
                if(got.length > 0 && !all.contains(got)){
                    all.push(got);
                }
            }else{
                var len = src.length;
                
                for(j = 0; j < src.length; j++) {
                    combine(index - 1, src.slice(j + 1), got.concat([src[j]]));
                }
            }
        }
        
        for(i = 0; i < len; i++) {
            combine(i, this, []);
        }
        
        all.push(this);
        
        return all;
    }
});

Fx.CSS.Em = new Class({	
	elementSearch: function(element){
	    var styles = ('.' + element.get('class').replace(' ', ' .')).split(' ');

	    var id = element.get('id');
	    
	    if(id){
    	    styles.push('#' + element.get('id'));
    	}
        
	    return styles.combine();
	}
});

Fx.Morph.Em = new Class({
    Extends: Fx.Morph,
    Implements: Fx.CSS.Em,
    
	initialize: function(element, options){
		this.element = this.subject = document.id(element);
		var styles = this.elementSearch(this.element);

		Array.each(styles, function(style){
		    this.element.setStyles(this.search(style.join('')));
		}, this);

		this.parent(this.element, options);
	}
});