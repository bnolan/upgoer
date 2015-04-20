(function($) {

$.widget('upgoer.upgoer', {
  dictionary: {},

  options: {
    input: $('<input type="text" />'),
    spelling: $('<div class="spelling"/>'),
    chatCallback: function() {},
    stemmer: function(word) { return(word); },
    synonyms: [],
    words: "the I to and a of was he you it in her she that my his me on with at as had for but him said be up out look so have what not just like go they is this from all we were back do one about know if when get then into would no there I'm could don't ask down time didn't want eye them over your are or been now an by think see hand it's say how around head did well before off who more even turn come smile way really can face other some right their only walk make got try something room again thing after still thought door here too little because why away let take two start good where never through day much tell wasn't girl feel oh you're call talk will long than us made friend knew open need first which people that's went sure seem stop voice very felt took our pull laugh man okay close any came told love watch arm anything I'll though put left work guy hair next couldn't yeah while mean home few saw place school help wait late year can't house happen last always move old night nod life give sit stare sat should moment another behind side sound once find toward boy ever nothing front mother name am since reply he's myself leave bed new car use mind maybe has heard answer minute yes until both found end small I'd word someone same enough began run bit sigh each those almost against everything most thank wouldn't mom better play I've own every hard remember three stood live stand second sorry keep finally point gave already actually probably himself big everyone guess lot step hey hear light quickly dad kiss black pick else soon shoulder table best without notice stay care phone reach realize follow decide kind she's grab he'd show inside suddenly father rest herself grin hour hope also body might hadn't floor its continue ran across hold cry half pretty great course mouth class kid miss wonder morning least nice dark slowly done change doesn't together yet question anyway bad blue believe week God lip Mr. sleep fine what's family many worry roll parents under surprise water onto we're glance wall between seen read window idea white push feet must such seat set please red brother these whole lean part person slightly pass shook fact wrong gone far hit finger quite hate meet finish heart book past kill reason anyone figure top along world she'd high shirt does today young held outside listen whisper won't happy ground deep drop shrug dress fell there's yell breath air tear sister chair kitchen matter hurt fall wear isn't woman eat lie hell suppose cover couple large either five leg jump die return able bag alone shut stuff short ready understand kept plan raise street different problem break line early cut cold paper scream instead stupid silence tree caught ear food full four cause fuck explain expect fight exactly sort completely men dance met story whatever build speak glass pain check glare corner Mrs. chest hot rather month real touch park bring they're drink ago force you've fast lost attention wish mark wave shout fill begin baby interest money fun green however cheek mine clear brown forward near picture may cool drive hug shake sense alright you'll dream hang clothes act become manage meant game ignore stair taken party add sometimes job ten shot date quiet gaze group loud straight dead neck beside pause number conversation chance we'll rose quietly town blood color desk dinner hall horse music brought piece anymore beautiful order fire office true although warm easy enter perfect mutter softly cross shock smirk damn soft stomach snap spoke tire box catch skin teacher middle note yourself haven't lunch tomorrow breathe clean except appear lock knock bathroom movie agree offer kick form confuse lay less calm slip weren't sign dog lift immediately arrive deal tonight usually case frown shop scare promise mum couch pay state shit wrap pocket hello free huge ride bother land known especially expression carry ring spot allow several aren't during empty lady eyebrow strange coffee road threw wide bus forget gotten smell fear press boyfriend blonde throw round sun tall glad age write upon hide became crowd rain save trouble annoy nose weird death beat tone trip six control nearly consider gonna join learn above hi obviously entire direction foot angry power strong quick doctor edge song asleep twenty barely remain child enjoy gun slow city broke key lead throat normal you'd somewhere wake pair sky funny business student giggle bright admit jeans given children store sweet low climb rub apartment knee shoe attack bedroom joke spent situation stuck gently possible cell mention silent definitely rush hung brush perhaps groan ass rock card lose blush besides crazy type bore afraid chase respond marry remind pack daughter serious girlfriend mad somehow buy sent tight simply trust imagine wind chuckle bar pink shove ball sight drag they'd human truth share area concern shouldn't team escape mumble often search apparently attempt son within band cute led memory anger fly paint bottle busy comment exclaim avoid grow grey mirror gasp hallway dear star sick cat counter interrupt none blink spend usual worse locker important favorite grip TV ice pretend settle amaze pop disappear carefully train stick guard teeth flash uncle send doubt visit nervous excite approach excuse fit noise study letter police eventually burn field hospital tie summer huh shift self hurry greet wife position we've wipe heavy slam broken complete space brain tiny pants ah punch shower tongue afternoon seriously cup further race recognize computer rang safe jacket bottom hundred relax sudden wow college flip mood track crack block handle themselves drove seven struggle whether ahead sad dry women focus repeat thick relationship jerk present suck bell surround evening bite single fault shadow wood easily woke smoke draw suggest wet accept third totally wore breakfast trail animal warn aunt sir piss burst match fix practically",
  },

  container: undefined,
  
  _create: function() {
    var self = this
    this.container = $('<div class="container"/>').appendTo(this.element)

    this._setOptions({
      'input':     this.options.input,  
      'spelling':  this.options.spelling,
      'chatCallback': this.options.chatCallback
    });

    var dictionary = this.dictionary;
    this.options.words.split(' ').forEach(function (word) {
      dictionary[preprocess(self, word)] = true;
    });

    var options = this.options;
    options.input.keyup(function (e) {
      var input     = options.input;
      var spelling  = options.spelling;

      var spellingResults = checkSpelling(self, input, spelling, dictionary);

      if(e.keyCode === 13){
        sendChat(self, input.val(), spellingResults);

        input.val('');
        spelling.empty();
      }

      if(e.keyCode === 27){
        input.val('');
        spelling.empty();
      }
    });
  },

  _setOption: function(key, value) {
    var self = this;
    var optionFunctions = {
      'input': function() {
        createInput(value, self);
      },
      'spelling': function() {
        createSpelling(value, self);
      }
    }

    if (key in optionFunctions) {
      optionFunctions[key]();
    }

    this._super(key, value);
  }
});

function preprocess(widget, word){
  return widget.options.stemmer(word.toLowerCase().replace(/[^a-z]/g, ''));
}

function sendChat(widget, text, blocks) {
  widget.options.chatCallback(text, blocks);
}

function computed_word_dimensions(word, font) {
  var sizer = $("<div />").text(word).css({'font': font, 'display' : 'inline-block'});
  var spacer = $("<div />").html(word + '&nbsp;').css({'font': font, 'display' : 'inline-block'});

  sizer.appendTo('body');
  spacer.appendTo('body')
  var word_width = sizer.width();
  var block_width = spacer.width();
  spacer.remove();
  sizer.remove();
  return({'word': word_width, 'offset': block_width});
}

function checkSpelling(widget, input, spelling){
  var words = input.val().split(' ');
  var results = [];
  input_border = input.css('border');
  var x = parseInt(input_border.replace(/(\d+)px.*/,'$1'));
  
  spelling.empty();

  words.forEach( function (word) {
    var font = input.css('font');
    var word_dimensions = computed_word_dimensions(word, font);
    var processed_word = preprocess(widget, word);

    var el = $("<b>&nbsp;</b>").css({width : word_dimensions['word'], left : x}).appendTo(spelling);
    
    if (widget.dictionary[word]){
      el.addClass('green');
    } else {
      el.addClass('red');
    }

    results = results.concat({word: word, presence: widget.dictionary[word]});
    x += word_dimensions['offset'];
  });
  return(results);
}

function createInput(value, widget) {
  existing = widget.options.input
  if (existing !== undefined && existing.parent === widget.container) {
    existing.replaceWith(value);
  } else {
    value.appendTo(widget.container);
  }
}

function createSpelling(value, widget) {
  existing = widget.options.spelling
  if (existing !== undefined && existing.parent === widget.container) {
    existing.replaceWith(value);
  } else {
    value.appendTo(widget.container);
  }
}

})(jQuery);