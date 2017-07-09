// JavaScript function that wraps everything
$(document).ready(function() {

  // Declare Variables
  var ships = {
    xwing: {
      armor: 30,
      power: 0,
      dodge: 30,
      speed: 1
    },
    ywing: {
      armor: 40,
      power: 0,
      dodge: 30,
      speed: 1
    },
    tieFighter: {
      armor: 10,
      power: 15,
      dodge: 60,
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
  var attackpower = 0;
  var attackarmor = 0;
  var attackdodge = 0;
  var attackspeed = 0;
  var defensepower = 0;
  var defensearmor = 0;
  var defensedodge = 0;
  var defensespeed = 0;
  var round = 0;
  var gameOver = false;
  var lineCount=0;


  // Game Runs here
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
    startgame.css("background-color","red");
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
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', './assets/images/XWing-Laser.wav');
      audioElement.play();
      // did defender dodge?
      if (Math.random() < defensedodge / 100) {
        // dodge successful
        //$("#gamearea").append("<p>Defender dodged the attack!</p>");
        lineCount++;
        $('<p>').attr('id', 'line'+lineCount).appendTo('#gamearea').html('Defender dodged the attack!');
        $("#line"+(lineCount-10)).remove();
      } else {
        //dodge fail compute damage
        var damage = Math.round(((100 - defensearmor) / 100) * attackpower);
        //$("#gamearea").append("<p>Defender took " + damage + " points of damage!</p>")
        lineCount++;
        $('<p>').attr('id', 'line'+lineCount).appendTo('#gamearea').html('Defender took '+ damage + ' points of damage!');
        $("#line"+(lineCount-10)).remove();
        if (attackingPlayer === "player") {
          computerHealth -= damage;
          console.log(computerHealth);
          if (computerHealth < .5 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (computerHealth < .25 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px red");
          }
          if (computerHealth <= 0) {
            //continue;
            attackerWin();
          } else {
            $(computerShip).effect("shake"); // on hit effect
          }
        } else {
          playerHealth -= damage;
          console.log(playerHealth);
          if (playerHealth < .5 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (playerHealth < .25 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px red");
          }
          if (playerHealth <= 0) {
            //continue;
            attackerWin();
          } else {
            $(playerShip).effect("shake"); // on hit effect
          }
        }
      }
    }
  }

  function defender() {
    console.log("function defender ran");
    for (i = 0; i < defensespeed; i++) {
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', './assets/images/TIE-Fire.wav');
      audioElement.play();
      // did defender dodge?
      if (Math.random() < attackdodge / 100) {
        // dodge successful
        //$("#gamearea").append("<p>Attacker dodged the counter attack!</p>");
        lineCount++;
        $('<p>').attr('id', 'line'+lineCount).appendTo('#gamearea').html('Attacker dodged the counter attack!');
        $("#line"+(lineCount-10)).remove();
      } else {
        //dodge fail compute damage
        var damage = Math.round(((100 - attackarmor) / 100) * defensepower);
        //$("#gamearea").append("<p>Attacker took " + damage + " points of damage!</p>");
        lineCount++;
        $('<p>').attr('id', 'line'+lineCount).appendTo('#gamearea').html('Attacker took ' + damage + ' points of damage!');
        $("#line"+(lineCount-10)).remove();        
        if (attackingPlayer != "player") {
          computerHealth -= damage;
          console.log(computerHealth);
          if (computerHealth < .5 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (computerHealth < .25 * totalComputerHealth) {
            $(computerShip).css("border", "solid 3px red");
          }
          if (computerHealth <= 0) {
            //continue;
            defenderWin();
          } else {
            $(computerShip).effect("shake"); // on hit effect
          }
        } else {
          playerHealth -= damage;
          console.log(playerHealth);
          if (playerHealth < .5 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
          }
          if (playerHealth < .25 * totalPlayerHealth) {
            $(playerShip).css("border", "solid 3px red");
          }
          if (playerHealth <= 0) {
            //continue;
            defenderWin();
          } else {
            $(playerShip).effect("shake"); // on hit effect
          }
        }
      }
    }
  }

  function defenderWin() {
    console.log("function defenderWin ran");
    $('.start').off('click');
    gameOver = true;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './assets/images/Explosion Large 2.wav');
    audioElement.play();
    $("#gamearea").empty();
    $("#gamearea").append("<p>The blockade stood the onslaught of the dirty rebel scum and their puny rebelion was crushed when the Deathstar destroyed the Forest Moon of Endor and the rebel base.</p>");
    $("#gamearea").append('<img src="assets\\images\\imperialseal.jpg" id="imperialseal" />');
    $("#imperialseal").css('margin-left','-200px');
    $("#imperialseal").fadeTo("slow",0.33);
    $("#imperialseal").animate({
      height: "600px",
      width: "auto"
    });

          //<img src="assets\images\xwing.jpg" class="img xwing" alt="X-Wing">
//
  }

  function attackerWin() {
    console.log("function attackerWin ran");
    $('.start').off('click');
    gameOver = true;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './assets/images/Explosion Large 2.wav');
    audioElement.play();
    $("#gamearea").empty();
    $("#gamearea").append("<p>The rebel alliance, against all odds, was able to successfully run the blockade, maneuver through the fully functional but not yet completed Deathstar to it's core and destroy it's central reactor therby saving the alliance and crippling the empire.</p>");
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

      // $(".tieInterceptor").effect("shake"); // on hit effect
      // $(".tieInterceptor").css("border", "solid 3px orange"); // green 0-50%; orange 50-75%; red 75-100% damage
    });
  }

  function computerPick() {
    var rdm = Math.random();
    console.log("random " + rdm);
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
    console.log("Player: " + playerShip);
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
    console.log("Computer: " + computerShip);
    letsPlay();
  }


});
