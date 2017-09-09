// JavaScript function that wraps everything
$(document).ready(function() {

  // Declare Variables
  // setting up multichannel sound array
  //http://www.storiesinflight.com/html5/audio.html
  var channel_max = 10; // number of channels
  var audiochannels = new Array();
  for (a = 0; a < channel_max; a++) { // prepare the channels
    audiochannels[a] = new Array();
    audiochannels[a]['channel'] = new Audio(); // create a new audio object
    audiochannels[a]['finished'] = -1; // expected end time for this channel
  }
  // arming star fighters
  var ships = {
    xwing: {
      armor: 30,
      power: 40,
      dodge: 20,
      speed: 1
    },
    ywing: {
      armor: 40,
      power: 30,
      dodge: 10,
      speed: 1
    },
    tieFighter: {
      armor: 10,
      power: 15,
      dodge: 50,
      speed: 2
    },
    tieInterceptor: {
      armor: 20,
      power: 30,
      dodge: 50,
      speed: 1
    }
  };
  var playerShip = "";
  var computerShip = "";
  var playerHealth = 100;
  var computerHealth = 100;
  var totalPlayerHealth = 100;
  var totalComputerHealth = 100;
  var attackingPlayer = "";
  var attackShip = "";
  var attackpower = 0;
  var attackarmor = 0;
  var attackdodge = 0;
  var attackspeed = 0;
  var defenseShip = 0;
  var defensepower = 0;
  var defensearmor = 0;
  var defensedodge = 0;
  var defensespeed = 0;
  var round = 0;
  var gameOver = false;
  var lineCount = 0;


  // Game Runs here
  $(".theme-button").on("click", function() {
    play_multi_sound('multiaudio4');
  });

  $(".pause-button").on("click", function() {
    pause_multi_sound('multiaudio4');
  });

  if (gameOver === false) {
    if (playerShip === "") {
      pickaship();
    } else {
      letsPlay();
    }
  }

  // gamefunctions

  function letsPlay() {
    var startgame = $("<button>");
    startgame.addClass("start");
    startgame.text("*  Fire!  *");
    startgame.css("background-color", "red");
    $("#gamearea").append(startgame);
    $('.start').on('click', function() {
      battleInit();
    });
  }

  function battleInit() {
    round++;
    if (playerShip.charAt(0) === ".") {
      var playerShipB = playerShip.slice(1);
      var computerShipB = computerShip.slice(1);
    }

    //load values for battle
    if (playerShipB === "xwing" || playerShipB === "ywing") {
      attackpower = ships[playerShipB]["power"];
      attackarmor = ships[playerShipB]["armor"];
      attackdodge = ships[playerShipB]["dodge"];
      attackspeed = ships[playerShipB]["speed"];
      defensepower = ships[computerShipB]["power"];
      defensearmor = ships[computerShipB]["armor"];
      defensedodge = ships[computerShipB]["dodge"];
      defensespeed = ships[computerShipB]["speed"];
    } else {
      defensepower = ships[playerShipB]["power"];
      defensearmor = ships[playerShipB]["armor"];
      defensedodge = ships[playerShipB]["dodge"];
      defensespeed = ships[playerShipB]["speed"];
      attackpower = ships[computerShipB]["power"];
      attackarmor = ships[computerShipB]["armor"];
      attackdodge = ships[computerShipB]["dodge"];
      attackspeed = ships[computerShipB]["speed"];
    }
    if (round % 2 === 0) {
      defender();
    } else {
      attack();
    }
  }

  function attack() {

    for (i = 0; i < attackspeed; i++) {
      play_multi_sound('multiaudio2');
      // did defender dodge?
      if (Math.random() < defensedodge / 100) {
        // dodge successful
        lineCount++;
        $('<p>').attr('id', 'line' + lineCount).appendTo('#gamearea').html('Defender dodged the attack!');
        $("#line" + (lineCount - 10)).remove();
      } else {
        //dodge fail compute damage
        var damage = Math.round(((100 - defensearmor) / 100) * attackpower);
        lineCount++;
        $('<p>').attr('id', 'line' + lineCount).appendTo('#gamearea').html('Defender took ' + damage + ' points of damage!');
        $("#line" + (lineCount - 10)).remove();
        if (attackingPlayer === "player") {
          computerHealth -= damage;
          if (computerHealth < .5 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (computerHealth < .25 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px red");
          }
          if (computerHealth <= 0) {
            attackerWin();
          } else {
            $(computerShip).effect("shake"); // on hit effect
          }
        } else {
          playerHealth -= damage;
          if (playerHealth < .5 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (playerHealth < .25 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px red");
          }
          if (playerHealth <= 0) {
            attackerWin();
          } else {
            $(playerShip).effect("shake"); // on hit effect
          }
        }
      }
    }
  }

  function defender() {
    for (i = 0; i < defensespeed; i++) {
      play_multi_sound('multiaudio1');
      // did defender dodge?
      if (Math.random() < attackdodge / 100) {
        // dodge successful
        lineCount++;
        $('<p>').attr('id', 'line' + lineCount).appendTo('#gamearea').html('Attacker dodged the counter attack!');
        $("#line" + (lineCount - 10)).remove();
      } else {
        //dodge fail compute damage
        var damage = Math.round(((100 - attackarmor) / 100) * defensepower);
        lineCount++;
        $('<p>').attr('id', 'line' + lineCount).appendTo('#gamearea').html('Attacker took ' + damage + ' points of damage!');
        $("#line" + (lineCount - 10)).remove();
        if (attackingPlayer != "player") {
          computerHealth -= damage;
          if (computerHealth < .5 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (computerHealth < .25 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px red");
          }
          if (computerHealth <= 0) {
            defenderWin();
          } else {
            $(computerShip).effect("shake"); // on hit effect
          }
        } else {
          playerHealth -= damage;
          if (playerHealth < .5 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (playerHealth < .25 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px red");
          }
          if (playerHealth <= 0) {
            defenderWin();
          } else {
            $(playerShip).effect("shake"); // on hit effect
          }
        }
      }
    }
  }

  function defenderWin() {
    $('.start').off('click');
    gameOver = true;
    $(".xwing").hide("explode", { pieces: 25 }, 2000);
    $(".ywing").hide("explode", { pieces: 25 }, 2000);
    play_multi_sound('multiaudio3');
    $("#gamearea").empty();
    $(".instructions").empty();
    $("#gamearea").append("<p>The blockade stood the onslaught of the dirty rebel scum. Their puny rebelion was crushed when the Deathstar destroyed the Forest Moon of Endor and the rebel base.</p>");
    $("#gamearea").append('<img src="assets\\images\\imperialseal.jpg" id="imperialseal" />');
    $("#imperialseal").animate({
      marginLeft: "-150px",
      height: "500px",
      width: "auto"
    }, 2000);
    $("#imperialseal").fadeTo("slow", 0.33);
    $(".instructions").append("<p> Press any key to play again... </p>");
    document.onkeyup = function(event) {
      window.location.reload();
    };
  }

  function attackerWin() {
    $('.start').off('click');
    gameOver = true;
    $(".tieInterceptor").hide("explode", { pieces: 25 }, 2000);
    $(".tieFighter").hide("explode", { pieces: 25 }, 2000);
    play_multi_sound('multiaudio3');
    $("#gamearea").empty();
    $(".instructions").empty();
    $("#gamearea").append("<p>The rebel alliance, against all odds, was able to successfully run the blockade, maneuver through the fully functional but not yet completed Deathstar to its core and destroy its central reactor therby saving the alliance and crippling the empire.</p>");
    $("#gamearea").append('<img src="assets\\images\\allianceseal.jpg" id="allianceseal" />');
    $("#allianceseal").animate({
      marginLeft: "-150px",
      height: "500px",
      width: "auto"
    }, 2000);
    $("#allianceseal").fadeTo("slow", 0.33);
    $('.instructions').append("<p> Press any key to play again... </p>");
    document.onkeyup = function(event){
      window.location.reload();
    };
  }

  function pickaship() {
    // Pick a ship
    $('.xwing').on('click', function() {
      playerShip = ".xwing";
      attackingPlayer = "player";
      $(".ywing").remove(); //remove the other attacker
      selectionComplete();
    });

    $('.ywing').on('click', function() {
      playerShip = ".ywing";
      attackingPlayer = "player";
      $(".xwing").remove(); //remove the other attacker
      selectionComplete();
    });

    $('.tieFighter').on('click', function() {
      playerShip = ".tieFighter";
      attackingPlayer = "computer";
      $(".tieInterceptor").remove(); //remove the other defense
      selectionComplete();
    });

    $('.tieInterceptor').on('click', function() {
      playerShip = ".tieInterceptor";
      attackingPlayer = "computer";
      $(".tieFighter").remove(); //remove the other defense
      selectionComplete();
    });
  }

  function computerPick() {
    var rdm = Math.random();
    switch (playerShip) {
      case ".xwing":
      case ".ywing":
        if (rdm < .5) {
          computerShip = ".tieFighter";
          $(".tieInterceptor").remove();
          compPickComplete();
        } else {
          computerShip = ".tieInterceptor";
          $(".tieFighter").remove();
          compPickComplete();
        }
        break;

      case ".tieInterceptor":
      case ".tieFighter":
        if (rdm < .5) {
          computerShip = ".xwing";
          $(".ywing").remove();
          compPickComplete();
        } else {
          computerShip = ".ywing";
          $(".xwing").remove();
          compPickComplete();

        }
        break;
    }
    $(computerShip).animate({
      height: "150px",
      top: "160px"
    });
  }

  function selectionComplete() {
    $('.ywing').off('click');
    $('.xwing').off('click');
    $('.tieFighter').off('click');
    $('.tieInterceptor').off('click');
    $("h2").remove(); // remove titles
    // move into attack position
    $(playerShip).animate({
      height: "150px",
      top: "160px"
    });
    computerPick();
  }

  function compPickComplete() {
    letsPlay();
  }

  function pause_multi_sound(s) {
    for (a = 0; a < audiochannels.length; a++) {
      audiochannels[a]['channel'].pause();
    }
  }

  function play_multi_sound(s) {
    for (a = 0; a < audiochannels.length; a++) {
      thistime = new Date();
      if (audiochannels[a]['finished'] < thistime.getTime()) { // is this channel finished?
        audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration * 1000;
        audiochannels[a]['channel'].src = document.getElementById(s).src;
        audiochannels[a]['channel'].load();
        audiochannels[a]['channel'].play();
        break;
      }
    }
  }

});
