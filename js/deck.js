var Deck = new Class({
    active: 0,
    previous: 0,
    Implements: [Options, Events],
    
    options: {
        /*onBuild: function(){},
        onCardIn: function(index){},
        onCardOut: function(index){},
        onCardStyle: function(index, style){},
        onCardAdded: function(index, card){},
        onCardRemoved: function(index, card){},
        onLoopFirst function(){},
        onLoopLast: function(){},
        */
        zindex: 1000,
        start: 0,
        loop: false,
        cascade_delta: true,
        auto_layout: true
    },
    
    initialize: function(cards, options){
        this.cards = $$(cards);
        
        this.setOptions(options);
        this.$build();
    },
    
    $build: function(){
        var self = this;
        this.container = this.cards[0].getParent();
        this.active = this.options.start;
        this.previous = this.options.start;
        
        if(this.options.auto_layout){
            this.cards.each(function(card, index){  
                card.setStyles(self.$getCardStyle(index));
            });
        }
        
        this.build();
        this.fireEvent('build');
        this.toCard(this.active);
        
        return this;
    },
    
    $cardIn: function(index){
        this.cardIn(index);
        this.fireEvent('cardIn', [index]);
        
        return this;
    },
    
    $cardOut: function(index){
        this.cardOut(index);
        this.fireEvent('cardOut', [index]);
        
        return this;
    },
    
    $getCardStyle: function(index){
        var style = this.cardStyle(index) || {};
        
        this.fireEvent('cardStyle', [index, style]);
        
        return style;
    },
    
    $moveAllCards: function(from, direction){      
        var start = this.cards.length - 1,
            end = direction === 'forward' ? from : 0,
            action = direction === 'forward' ? '$cardIn' : '$cardOut';
        
        for(var x = start; x >= end; x--){
            if(x < this.active){
                this[action](x);
            }else{
                var style = this.$getCardStyle(x);
                this.cardMove(x, style);
            }
        }
        
        return this;
    },
    
    build: function(){
        return this;
    },

    cardStyle: function(index){
        return {}
    },

    cardIn: function(index){
        var card = this.cards[index];
        
        if(card){
            card.setStyle('display', 'block');
        }
        
        return this;
    },

    cardOut: function(index){
        var card = this.cards[index];
        console.log('card out', index, card)
        if(card){
            card.setStyle('display', 'none');
        }
        
        return this;
    },

    cardMove: function(index, style){
        return this;
    },
    
    toCard: function(index){
        if(index !== this.active){
            var direction = index < this.active ? 'forward' : 'backward';
            
            if(direction === 'forward'){
                this.$cardOut(this.active);
            }else{
                this.$cardIn(index);
            } 
            
            this.previous = this.active;
            this.active = index;
            
            if(this.options.cascade_delta){
                this.$moveAllCards(index, direction);
            }           
            
            this.fireEvent('toCard', [index, direction]);
            
            if(index === 0){
                this.fireEvent('first');
            }
            
            if(index === this.cards.length - 1){
                this.fireEvent('last');
            }
        }
        
        return this;
    },
    
    nextCard: function(){
        var next = this.active - 1 > -1 
            ? this.active - 1 
            : this.options.loop
                ? this.cards.length - 1
                : 0;
                
        if((this.active + 1) === this.cards.length){
            this.fireEvent('onLoopLast');
        }
        
        return this.toCard(next);
    },
    
    previousCard: function(){
        var previous = this.active + 1 < this.cards.length 
            ? this.active + 1 
            : this.options.loop
                ? 0
                : this.active;
        
        if((this.active - 1) === 0){
            this.fireEvent('onLoopFirst');
        }
        
        return this.toCard(previous);
    },
    
    addCard: function(card, position, animate){
        var element
            pos = position;
        
        switch(typeOf(card)){
            case 'function':
                element = card();
                break;
                
            case 'element':
                element = card;
                break;
                
            case 'string':
                element = new Element('div', {
                    'html': card
                });
                break;
        }
        
        if(position === 'first'){
            pos = 0;
            element.inject(this.cards[pos], 'before');
        }else if(position === 'last'){
            pos = this.cards.length;
            element.inject(this.contianer, 'bottom');
        }else if(isNaN(position)){
            pos = position;
            element.inject(this.cards[pos], 'before');
        }
        
        if(pos < this.active){
            this.active++;
        }
        
        this.cards.splice(pos, 0, element);
        this.fireEvent('cardAdded', [pos, card]);
        
        var style = this.$getCardStyle(pos);

        if(pos >= this.active){
            if(this.options.cascade_delta){
                var direction = pos < this.active ? 'forward' : 'backward';
                this.$moveAllCards(pos, direction);
            }
            
            this.cardMove(pos, style);
        }else{
            style['display'] = 'none';
            element.setStyles(style);
        }
        
        return this;
    },
    
    removeCard: function(index){
        if(this.cards[index]){
            this.cardOut(index);
            
            var card = this.cards.splice(index, 1);
            
            this.$moveAllCards(index, index > this.active ? 'forward' : 'backward');
            this.fireEvent('cardRemoved', [index, card]);
        }
        
        return this;
    }
});