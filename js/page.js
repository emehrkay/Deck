var Page = new Class({
    $active: 0,
    zindex: 10000,
    
    Implements: [Options, Events],
    
    options: {
        /*onFirst: function(){},
        onLast: function(){},
        onBuild: function(){},*/
        pageIn: function(index){
            var page = this.$pages[index],
                fx = page.get('morph'); 

            fx.setOptions({
                unit: '%',
                duration: 500
            });

            page.setStyle('display', 'block');
            fx.start({            
                width: '110%',
                left: '-5%',
                height: '100%',
                top: '2%',
                'z-index': this.zindex + 10,
                opacity: 1,
                height: '100%'
            });
        },
        pageOut: function(index){
            var page = this.$pages[index],
                fx = page.get('morph'); 

            fx.setOptions({
                unit: '%',
                duration: 500
            });

            fx.start({
                width: 115,
                left: -7.5,
                height: 105,
                opacity: 0
            }).chain(function(){
                page.setStyle('display', 'none')
                    .set('class', 'page out');
            });
        },
        pageStyle: function(index){
            var diff = this.$active - index,
                width = this.options.style.width + (diff * 5),
                style;

            if(Math.abs(diff) > 3){
                style = {
                    'z-index': this.zindex--,
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
                    'z-index': this.zindex + 10,
                    opacity: 1,
                    height: '100%'
                };
            }else{
                style = {
                    'z-index': this.zindex--,
                    width: width + '%',
                    left: ((100 - width) / 2) + '%',
                    top: diff * 2 + 1 + '%',
                    height: '100%',
                    opacity: 1
                };
            }

            return style;
        },
        page: '.page',
        container: '.page_container',
        style: {
            width: 110,
            top: 2
        },
        fx: {
            unit: '%',
            duration: 500
        }
    },
    
    initialize: function(options){
        this.setOptions(options);
        this.$build();
    },
    
    $build: function(){
        var self = this;
        this.$container = document.getElement(this.options.page_container);
        this.$queue_clone = document.getElement(this.options.page).clone().empty();
        this.$pages = $$();
        
        for(var i = 0; i < 5; i++){
            this.addPage(new Element('div', {
                'class': 'page page_queue',
                'text': 'queue '+ i
            }));
        }
        
        this.$pages = $$(this.options.page);
        
        this.$pages.each(function(page, index){            
            page.setStyles(self.$getPageStyle(index));
        });
        
        this.fireEvent('build');
        
        return this;
    },
    
    toPage: function(index){
        var check = index > this.$active ? this.$active : index;
        
        if(index !== this.$active && !this.$pages[check].hasClass('page_queue')){
            var direction = index > this.$active ? 'forward' : 'backward';
            
            if(direction === 'forward'){
                this.$pageOut(this.$active);
                
                for(var i = 0; i < index; i++){
                    this.$pageOut(i);
                }
            }else{
                this.$pageIn(index);
            }
            
            this.$previous = this.$active;
            this.$active = index;

            if(direction === 'forward'){
                this.$bringAllForward();
            }else{
                this.$sendAllBackward();
            }
            
            if(index === 0){
                this.fireEvent('first');
            }
            
            if(index === this.$pages.length - 1){
                this.fireEvent('last');
            }
        }
        
        return this;
    },
    
    nextPage: function(){
        var next = this.$active + 1 < this.$pages.length ? this.$active + 1 : this.$active;

        return this.toPage(next);
    },
    
    previousPage: function(){
        var previous = this.$active -1 > -1 ? this.$active - 1 : this.$active;

        return this.toPage(previous);
    },
    
    addPage: function(content, queue){
        var pos = queue ?  'push' : 'unshift',
            loc = queue ? 'bottom' : 'top',
            element = content;
        
        switch(typeOf(content)){
            case 'string':
                element = new Element('div', {
                    'html': content
                });
                break;
                
            case 'function':
                element = content();
                break;
        }
        
        this.$pages[pos](element);
        this.$container.adopt(element, loc);

        return this;
    },
    
    $bringAllForward: function(){
        var len = this.$pages.length - 1,
            index = 0,
            i;

        for(i = 0; i < len; i++){
            if(i >= this.$active){
                this.$pageStepForward(i);
            }
        }
        
        return this;
    },
    
    $sendAllBackward: function(){
        var len = this.$pages.length - 1,
            index = 0,
            max = Math.max(this.$active, this.$previous),
            i;

        for(i = 0; i < len; i++){
            if(i > this.$active){
                this.$pageStepBackward(i);
            }
        }

        return this;
    },
    
    $pageStepForward: function(index, set){
        var page = this.$pages[index],
            fx = page.get('morph'),
            style = this.$getPageStyle(index);

        if(set){
            page.setStyles(style);
        }else{
            fx.setOptions(this.options.fx);
            fx.start(style);
        }

        return this;
    },
    
    $pageStepBackward: function(index, set){
        var page = this.$pages[index],
            fx = page.get('morph'),
            style = this.$getPageStyle(index);
            
        page.setStyle('display', 'block');
        
        if(set){
            page.setStyles(style);
        }else{
            fx.setOptions(this.options.fx);
            fx.start(style);
        }
        
        return this;
    },
    
    $pageOut: function(index){
        this.options.pageOut.apply(this, [index]);
        
        return this;
    },
    
    $pageIn: function(index){
        this.options.pageIn.apply(this, [index]);
        
        return this;
    },
    
    $getPageStyle: function(index){
        return this.options.pageStyle.apply(this, [index]) || {};
    }
});