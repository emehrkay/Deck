Deck.Grid = new Class({
    Extends: Deck,
    card_size: {
        x: 0,
        y: 0
    },
    
    options: {
        deck: 'deck',
        columns: 4,
        auto_layout: false,
        card: {
            'margin-top': 5,
            'margin-bottom': 5,
            'margin-left': 5,
            'margin-right': 5
        }
    },
    
    build: function(){
        var self = this;

        if(this.cards.length){
            this.card_size = this.cards[0].getSize();
        }
        
        Array.each(this.cards, function(card, index){
            var style = self.$getCardStyle(index);
            
            self.cardMove(index, style);
        });
        
        //return this.parent();
    },
    
    cardIn: function(index){
        return this;
    },
    
    cardOut: function(index){
        return this;
    },
    
    cardMove: function(index, style){
        var card = this.cards[index],
            fx = card.get('morph');
            
        fx.setOptions({
            duration: 500
        });
        
        fx.start(style);
    },
    
    cardStyle: function(index){
        var card = this.options.card,
            x = Math.max((index % this.options.columns), 0),
            y = Math.max(Math.ceil((index + 1) / this.options.columns - 1), 0),
            margins = {
                top: y * (card['margin-top'] + card['margin-bottom']),
                left: x * (card['margin-left'] + card['margin-right'])
            };

        return {
            top: y * this.card_size.y + margins.top,
            left: x * this.card_size.x + margins.left 
        };
    }
});

Deck.Grid.Drag = new Class({
    Extends: Deck.Grid,
    
    build: function(){
        this.parent();
    }
});