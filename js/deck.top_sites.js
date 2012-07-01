Deck.TopSites = new Class({
    Extends: Deck.Grid,
    
    options: {
        card: {
            width: 90,
            height: 100,
            depth: -200,
            rotateY: 15
        }
    },
    
    cardMove: function(index, style){
        var card = this.cards[index],
            fx = card.get('morph')
            fx_set = fx.set;
        
        card.animate(style);
    },
    
    cardStyle: function(index){
        var self = this,
            x = Math.max((index % this.options.columns), 0),
            y = Math.max(Math.ceil((index + 1) / this.options.columns - 1), 0),
            style = this.parent(index),
            total_width = this.options.columns * (this.options.card.width + this.options.card['margin-left'] + this.options.card['margin-right']),
            half = Math.floor(this.options.columns / 2),
            odd = !!(this.options.columns % 2),
            distance = Math.abs(half - x),
            origin = index < half ? '100% 0%' : '0% 0%',
            trans_z = this.options.card.depth;
        var rotateY = distance * this.options.card.rotateY;
        var total_half = total_width / 2,
            left = total_half,
            angle = 0,
            hyp = self.options.card.width + self.options.card['margin-left'] + self.options.card['margin-right'];
            
        (function(){
            for(var i = 0; i < distance; i++){
                angle += self.options.card.rotateY; 

                var rad = angle * Math.PI / 180,
                    dist = Math.cos(rad) * hyp,
                    wid = ((x + 1) * self.options.card.width)

                if(x !== i){
                    left = wid - dist;
                }
            }
            
            if(!odd){
                if(x === half - 1 || x === half + 1 || x == half){
                    angle = self.options.card.rotateY;
                    trans_z = self.options.card.depth;
                }
            }
            
            if(x > half){
                angle = (angle + self.options.card.rotateY) * -1;
            }
            
            if(x === 0){
                left = 0;
            }
            
            var trans_angle = Math.abs(angle) - self.options.card.rotateY,
                trans = 0;
            
            while(trans_angle > 0){
                var rad = trans_angle * Math.PI / 180;
                trans += Math.sin(rad) * hyp;
                
                trans_angle -= self.options.card.rotateY;
            }
            trans_z += trans;
            //console.log('index: %s x: %s angle: %s left: %s trans_z: %s', index, x, angle, left, trans_z, half)
        }());
        
        style['left'] = left;
        style['transform-origin'] = origin;
        style['transform'] = 'translateZ('+ trans_z +'px) rotateY('+ angle +'deg)';

        return style;
    }
});