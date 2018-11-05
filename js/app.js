// Your VueJS code goes here
const vm = new Vue({
  el: "#app",
  data: {
    lines: [],
    digs: ['','','',''],
    pc_digs: ['','','',''],
    message: "nothing here ...",
    rating: "",
    showInput: true
  },

  methods: {
    init(){
      //Setup game
      this.pc_digs = [this.rN(9), this.rN(9),this.rN(9),this.rN(9)];
      this.message = "Enter 4 digits to guess my number ..." //+ this.pc_digs.join(',')
    },

    rN(max) {
      rn = 0;
      for (var i = 0; i < 100; i++) {
        rn = Math.floor(Math.random() * (max+1))
      };
      return rn
    },

    nxt(k){if (k<3) this.$refs.key[k+1].focus();},
    prv(k){if (k>0) this.$refs.key[k-1].focus();},
    isNr: function(k, event) {
      n = this.digs[k];
      //console.log(event.key, k, n);
      if (parseInt(event.key, 10) >= 0) {this.nxt(k); }
      else if (event.key == "Backspace") {this.prv(k)};
      if (!n.match(/[0-9]/)) {
        this.$refs.key[k].value = "";
        this.digs[k] = "";
        //this.message = "Enter digits only";
        //this.rating = "";
      };      
    },

    rateLine() {
      if (this.digs.includes(''))
        this.message = "Please enter 4 digits"
      else {
        this.message = "You have: ";
        this.rating = this.rateNumber(this.digs.slice(),this.pc_digs.slice());
        this.$refs.key[0].focus();
      }
    },

    rateNumber(guess, given) {
      var pos = 0; var neg = 0;
      new_line = guess.slice();
      new_rating = [];

      // count and remove positives
      for (var i=0; i < given.length; i++){
        console.log("compare pos " + i + ": ", guess[i] , given[i], guess.join(''), given.join(''));
        if (guess[i] == given[i]) {
          pos++; new_rating.push("+");
          guess.splice(i,1);
          given.splice(i,1);
          // length was reduced by 1; adjust i
          i--;
        }
      };

      // count and remove negatives
      for (var i=0; i < given.length; i++){
        var j = parseInt(guess[i], 10);
        // alert ("val: " + j + " type: " + typeof(j));
        found = given.indexOf(parseInt(guess[i], 10));
        console.log("found at pos " +i+ ": ", found, guess[i], " in ", given.join(''));
        // remove if found
        if (found >= 0) {
          neg++; new_rating.push("-");
          guess.splice(i,1);
          given.splice(found,1);
          // length was reduced by 1; adjust i
          i--;
        }
      };

      //console.log(pos, neg);
      res = pos + " digits in correct position and " + neg + " misplaced";
      //console.log(res);
      //console.log(new_line);
      if (pos == 4) this.showInput = false;
      new_row = {line: new_line, rating: new_rating};
      this.lines.push(new_row);
      this.digs = ['','','',''];
      return res;
    }
  },

  // Register a global custom directive called `v-focus`
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.focus()
      }
    }
  },

  mounted(){
    this.init();
    this.$refs.key[0].focus();
  }

});