Deck.TimeMachine = new Class({
    Extends: Deck,
    
    cardStyle: function(index){
        var diff = this.active - index,
            width = this.options.card_width + (diff * 5),
            style = {};

        if(diff < -3){
            style = {
                'z-index': this.options.zindex + diff,
                width: '90%',
                left: '5%',
                top: '-7%',
                height: '100%',
                opacity: 1
            };
        }else if(diff === 0){
            style = {            
                width: '110%',
                left: '-5%',
                height: '100%',
                top: '2%',
                'z-index': this.options.zindex += 1,
                opacity: 1,
                height: '100%'
            };
        }else if(diff > 0){
            style = {
                width: '115%',
                left: '-7.5%',
                height: '105%',
                opacity: 0,
                'z-index': this.options.zindex + this.cards.length
            };
        }else{
            style = {
                'z-index': this.options.zindex + diff,
                width: width + '%',
                left: ((100 - width) / 2) + '%',
                top: diff * 2 + 1 + '%',
                height: '100%',
                opacity: 1
            };
        }

        return style;
    },
    
    cardIn: function(index){
        var card = this.cards[index],
            fx = card.get('morph'),
            style = this.cardStyle(this.active); 

        fx.setOptions({
            unit: '%',
            duration: 500
        });
        
        card.setStyles({
            'display': 'block'
        });
        
        fx.start(style);
    },
    
    cardOut: function(index){
        var card = this.cards[index],
            fx = card.get('morph'),
            style = this.cardStyle(-1); 
console.log('card out', index, style)
        fx.setOptions({
            unit: '%',
            duration: 500
        });

        card.setStyle('display', 'block');
        fx.start(style).chain(function(){
            card.setStyle('display', 'none');
        });
    },
    
    cardMove: function(index, style){
        var card = this.cards[index],
            fx = card.get('morph'),
            update_index = function(){
                if(style['z-index']){
                    card.setStyle('z-index', style['z-index']);
                }
            };
        
        fx.setOptions({
            unit: '%',
            duration: 500
        });

        card.setStyle('display', 'block');

        if(index < this.active || index === 0){
            update_index();
        }
        
        fx.start(style).chain(function(){
            update_index();
        });
    }
});