// JavaScript Document

// ------------------------- //
// ===== MAP FUNCTIONS ===== //
// ------------------------- //

var _MAP = [
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0]
];

var _MOUNTAIN = [[1,1],[3,8],[5,3],[8,9],[9,5]];

function MapClear() {
	for (var i=0; i<11; i++) {
		for (var j=0; j<11; j++) {
			_MAP[i][j] = 0;
		}
	}
	
	_MAP[1][1] = 9;
	_MAP[3][8] = 9;
	_MAP[5][3] = 9;
	_MAP[8][9] = 9;
	_MAP[9][5] = 9;
	
	var map_cells = document.querySelectorAll(".map-cell");
	map_cells.forEach(function(map_cell) {
		map_cell.style.backgroundImage = "";
	});
	
	for (var i=0; i<_MOUNTAIN.length; i++) {
		_MAP[_MOUNTAIN[i][0]][_MOUNTAIN[i][1]] = 9;
		var cellname = "mapcell-" + _MOUNTAIN[i][0] + "-" + _MOUNTAIN[i][1];
		document.getElementById(cellname).setAttribute("style", "background-image: url('images/tiles/mountain.png');");
	}
	
}

function MapDraw() {
	var html_map = "";
	
	for (var i=0; i<_MAP.length; i++) {
		for (var j=0; j<_MAP[i].length; j++) {
			var bg = "";
			switch(_MAP[i][j]) {
				case 1: bg = "url('images/tiles/water.png');"; break;
				case 2: bg = "url('images/tiles/town.png');"; break;
				case 3: bg = "url('images/tiles/forest.png');"; break;
				case 4: bg = "url('images/tiles/farm.png');"; break;
				case 9: bg = "url('images/tiles/mountain.png');"; break;
			}
			html_map += "<div class=\"map-cell\" id=\"mapcell-" + i + "-" + j + "\" data=\"" + i + "|" + j + "\" style=\"background-image:" + bg + "\"></div>";
		}
	}
	
	document.getElementById("game-map").innerHTML = html_map;
}

function MapElementCheck(aPos) {
	var _OtherElementExist = false;
	_DROP_READY = true;
	
	var ele = ReShape(_ELEMENT.shape);
	
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			if (ele[i][j]==1) {
				var nRow = parseInt(aPos[0]) + i;
				var nCol = parseInt(aPos[1]) + j;
				
				try {
					if (_MAP[nRow][nCol]>0) {
						_OtherElementExist = true;
					}

					var cellname = "mapcell-" + nRow + "-" + nCol;				
					document.getElementById(cellname).style.borderColor = "#86ab50";
				} catch {
					_DROP_READY = false;						
				}
			} 
		}
	}
					
	if (!_DROP_READY) {
		var map_cells = document.querySelectorAll(".map-cell");
		map_cells.forEach(function(cell) {
			cell.style.borderColor = "#ffffff";
		});
	} else {
		if (_OtherElementExist) {
			for (var i=0; i<3; i++) {
				for (var j=0; j<3; j++) {
					if (ele[i][j]==1) {
						var nRow = parseInt(aPos[0]) + i;
						var nCol = parseInt(aPos[1]) + j;

						var cellname = "mapcell-" + nRow + "-" + nCol;
						document.getElementById(cellname).style.borderColor = "red";
					} 
				}
			}
			
			_DROP_READY = false;
		}
	}
}
			
function MapElementDrop(aPos) {
	var ele = ReShape(_ELEMENT.shape);
	var sType = _ELEMENT.type;
	var nType = 0;
	
	switch(sType) {
		case "water": nType=1; break;
		case "town": nType=2; break;
		case "forest": nType=3; break;
		case "farm": nType=4; break;
	}
	
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			if (ele[i][j]==1) {
				var nRow = parseInt(aPos[0]) + i;
				var nCol = parseInt(aPos[1]) + j;
				
				_MAP[nRow][nCol] = nType;
				var cellname = "mapcell-" + nRow + "-" + nCol;
				document.getElementById(cellname).setAttribute("style", "background-image: url('images/tiles/" + sType + ".png');");
			} 
		}
	}
	
	var bIsEndGame = false;
	_TIME_CURRENT += _ELEMENT.time;	
	
	ScoreCalc(_MISSIONS[0], 0);
	ScoreCalc(_MISSIONS[1], 1);
	ScoreCalc(_MISSIONS[2], 2);
	ScoreCalc(_MISSIONS[3], 3);
	ScoreCalc(99, 4);
	
	MissionScoreUpdate();
	
	if (_TIME_CURRENT>=7) {		
		_SEASON += 1;
		SeasonScoreUpdate();		
		SeasonDraw();
		if (_SEASON>3) {
			bIsEndGame = true;
		} else {
			_TIME_CURRENT = 0;			
		}		
	}
	
	document.getElementById("lblCurrentTime").innerHTML = _TIME_CURRENT;
	
	if (bIsEndGame) {
		EndGame();
	} else {
		ElementNew();
	}
}

// ----------------------------- //
// ===== ELEMENT FUNCTIONS ===== //
// ----------------------------- //

function ElementClear() {
	var elementCells = document.getElementsByClassName("element-cell");
	
	for (var i=0; i<elementCells.length; i++) {
		elementCells[i].style.backgroundImage = "";
	}
}

function ElementDraw() {
	var shape = _ELEMENT.shape;
	var type = _ELEMENT.type;
	
	ElementClear();
	for (var i=0; i<shape.length; i++) {
		for (var j=0; j<shape[i].length; j++) {
			if (shape[i][j]==1) {
				var eCell = document.getElementById("eCell" + i + "" + j);
				eCell.style.backgroundImage = "url('images/tiles/" + type + ".png')";
			}
		}
	}
	
	document.getElementById("lblElementTime").innerHTML = _ELEMENT.time;
}

function ElementNew() {
	var nIndex = getRandomIntInclusive(0, 15);
	_ELEMENT = _ELEMENTS[nIndex];
	ElementDraw();
	
	SaveGame();
}
			
function ElementRotate() {
	_ELEMENT.shape = MatrixRotate(_ELEMENT.shape);
	ElementDraw();
}

function ElementFlip() {
	_ELEMENT.shape = MatrixFlip(_ELEMENT.shape);
	ElementDraw();
}

// ----------------------------- //
// ===== MISSION FUNCTIONS ===== //
// ----------------------------- //
			
function MissionRandom() {
	_MISSIONS = ArrayShuffle(_MISSIONS);
}

function MissionDraw() {	
	for (var i=0; i<4; i++) {
		var mission;
		if (_MISSIONS[i]<=3) {
			mission = _MISSION_DATA.basic[_MISSIONS[i]];
		} else {
			mission = _MISSION_DATA.extra[_MISSIONS[i]-4];
		}
		
		document.getElementById("lblMission" + i + "Score").innerHTML = "0 points";
		document.getElementById("lblMission" + i + "Content").innerHTML = "<span>" + mission.title + "</span><br>" + mission.description;
		document.getElementById("lblMission" + i + "Content").style.backgroundImage = "url('images/missions/" + _MISSIONS[i] + ".jpg')";
	}
	
	document.getElementById("lblCurrentTime").innerHTML = _TIME_CURRENT;	
}
			
function MissionScoreUpdate() {
	var M0 = 0;
	var M1 = 0;
	var M2 = 0;
	var M3 = 0;
	
	if (_SEASON==0) {
		M0 = _MISSION_SCORE[_SEASON][0];
		M1 = _MISSION_SCORE[_SEASON][1];
		M2 = _MISSION_SCORE[_SEASON][2];
		M3 = _MISSION_SCORE[_SEASON][3];
	} else {
		if (_MISSION_SCORE[_SEASON][0]>0) M0 = _MISSION_SCORE[_SEASON][0] - _MISSION_SCORE[_SEASON-1][0];
		if (_MISSION_SCORE[_SEASON][1]>0) M1 = _MISSION_SCORE[_SEASON][1] - _MISSION_SCORE[_SEASON-1][1];
		if (_MISSION_SCORE[_SEASON][2]>0) M2 = _MISSION_SCORE[_SEASON][2] - _MISSION_SCORE[_SEASON-1][2];
		if (_MISSION_SCORE[_SEASON][3]>0) M3 = _MISSION_SCORE[_SEASON][3] - _MISSION_SCORE[_SEASON-1][3];
	}
	
	switch(_SEASON) {
		case 0: M2 = 0; M3 = 0; break;
		case 1: M0 = 0; M3 = 0; break;
		case 2: M0 = 0; M1 = 0; break;
		case 3: M1 = 0; M2 = 0; break;
	}
	
	document.getElementById("lblMission0Score").innerHTML = M0 + " points";
	document.getElementById("lblMission1Score").innerHTML = M1 + " points";
	document.getElementById("lblMission2Score").innerHTML = M2 + " points";
	document.getElementById("lblMission3Score").innerHTML = M3 + " points";
}

// ---------------------------- //
// ===== SEASON FUNCTIONS ===== //
// ---------------------------- //
			
function SeasonDraw() {	
	document.getElementById("lblMission0Title").style.color = "#000000";
	document.getElementById("lblMission1Title").style.color = "#000000";
	document.getElementById("lblMission2Title").style.color = "#000000";
	document.getElementById("lblMission3Title").style.color = "#000000";
	
	var sSeason = "";
	switch(_SEASON) {
		case 0:
			sSeason = "Spring (AB)";
			document.getElementById("lblMission0Title").style.color = "#5b9bd5";
			document.getElementById("lblMission1Title").style.color = "#5b9bd5";
			break;
		case 1:
			sSeason = "Summer (BC)";
			document.getElementById("lblMission1Title").style.color = "#5b9bd5";
			document.getElementById("lblMission2Title").style.color = "#5b9bd5";
			break;
		case 2:
			sSeason = "Autumn (CD)";
			document.getElementById("lblMission2Title").style.color = "#5b9bd5";
			document.getElementById("lblMission3Title").style.color = "#5b9bd5";
			break;
		case 3:
			sSeason = "Winter (DA)";
			document.getElementById("lblMission3Title").style.color = "#5b9bd5";
			document.getElementById("lblMission0Title").style.color = "#5b9bd5";
			break;
	}
	document.getElementById("lblCurrentSeason").innerHTML = sSeason;	
	
	var nTotalScore = 0;
	for (var i=0; i<4; i++) {
		document.getElementById("lblSeason" + i + "Score").innerHTML = _SEASON_SCORE[i] + " points";
		nTotalScore += _SEASON_SCORE[i];
	}
	
	nTotalScore += _SEASON_SCORE[4];
	document.getElementById("lblTotalScore").innerHTML = "Total: " + nTotalScore + " points";
}
			
function SeasonScoreUpdate() {
	switch(_SEASON-1) {
		case 0: _SEASON_SCORE[0] = _MISSION_SCORE[0][0] + _MISSION_SCORE[0][1]; break;
		case 1: _SEASON_SCORE[1] = (_MISSION_SCORE[1][1] - _MISSION_SCORE[0][1]) + (_MISSION_SCORE[1][2] - _MISSION_SCORE[0][2]); break;
		case 2: _SEASON_SCORE[2] = (_MISSION_SCORE[2][2] - _MISSION_SCORE[1][2]) + (_MISSION_SCORE[2][3] - _MISSION_SCORE[1][3]); break;
		case 3: _SEASON_SCORE[3] = (_MISSION_SCORE[3][3] - _MISSION_SCORE[2][3]) + (_MISSION_SCORE[3][0] - _MISSION_SCORE[2][0]); break;
	}
	
	document.getElementById("lblMission0Score").innerHTML = "0 points";
	document.getElementById("lblMission1Score").innerHTML = "0 points";
	document.getElementById("lblMission2Score").innerHTML = "0 points";
	document.getElementById("lblMission3Score").innerHTML = "0 points";
}

// -------------------------------- //
// ===== SCORE CALC FUNCTIONS ===== //
// -------------------------------- //
			
function ScoreCalc(mission, pos) {
	var score = 0;
	
	switch(mission) {
		case 99: // Surrounded mountain
			for (var i=0; i<_MOUNTAIN.length; i++) {
				var nPos = _MOUNTAIN[i];
				var bIsOK = true;
				if (_MAP[nPos[0]][nPos[1]-1]==0) bIsOK = false; // Left
				if (_MAP[nPos[0]][nPos[1]+1]==0) bIsOK = false; // Right
				if (_MAP[nPos[0]-1][nPos[1]]==0) bIsOK = false; // Top
				if (_MAP[nPos[0]+1][nPos[1]]==0) bIsOK = false; // Bottom
				
				if (bIsOK) score += 1;
			}
			break;
			
		case 0: // Edge of the forest
			for (var i=0; i<11; i++) {
				if (_MAP[0][i]==3) score += 1;
				if (_MAP[10][i]==3) score += 1;
			}
			
			for (var i=1; i<10; i++) {
				if (_MAP[i][0]==3) score += 1;
				if (_MAP[i][10]==3) score += 1;
			}
			break;
			
		case 1: // Sleepy valley
			for (var i=0; i<11; i++) {
				var nForest = 0;
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==3) nForest++;
				}
				if (nForest==3) score += 4;
			}
			break;
			
		case 2: // Watering potatoes
			for (var i=0; i<11; i++) {
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==1) {
						var bIsNearFarm = false;
						var x = i - 1; var y = j; // Left
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==4) bIsNearFarm = true; }
						x = i; y = j + 1; // Right
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==4) bIsNearFarm = true; }
						x = i + 1; y = j; // Top
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==4) bIsNearFarm = true; }
						x = i; y = j - 1; // Bottom
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==4) bIsNearFarm = true; }
						
						if (bIsNearFarm) score += 2;
					}
				}
			}
			break;
			
		case 3: // Borderlands
			for (var i=0; i<11; i++) {
				var bIsFullRow = true;
				var bIsFullCol = true;
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==0) bIsFullRow=false;
					if (_MAP[j][i]==0) bIsFullCol=false;
				}
				if (bIsFullRow) score += 6;
				if (bIsFullCol) score += 6;
			}
			break;
			
		case 4: // Tree line
			var nMax = 0;
			var nMaxCol = 0;
			var nCount = 0;
			for (var i=0; i<11; i++) {
				nCount = 0;
				for (var j=0; j<11; j++) {
					if (_MAP[j][i]==3) {
						nCount++;
						if (nCount>nMaxCol) nMaxCol = nCount;
					} else {
						nCount = 0;
					}
				}
				if ((nMaxCol>1)&&(nMaxCol>nMax)) nMax = nMaxCol;
			}
			
			score = nMax * 2;
			break;
			
		case 5: // Watering canal
			var nWater = 0;
			var nFarm = 0;
			
			for (var i=0; i<11; i++) {
				nWater = 0;
				nFarm = 0;
				for (var j=0; j<11; j++) {
					if (_MAP[j][i]==1) { nWater++; }
					if (_MAP[j][i]==4) { nFarm++; }
				}
				if ((nWater>0)&&(nWater==nFarm)) score += 4;
			}
			break;
			
		case 6: // Wealthy town
			for (var i=0; i<11; i++) {
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==2) {
						var aCheck = [0, 0, 0, 0];
						for (var k=1; k<5; k++) {
							var x = i - 1; var y = j; // Left
							if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==k) aCheck[k-1] = 1; }
							x = i; y = j + 1; // Right
							if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==k) aCheck[k-1] = 1; }
							x = i + 1; y = j; // Top
							if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==k) aCheck[k-1] = 1; }
							x = i; y = j - 1; // Bottom
							if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==k) aCheck[k-1] = 1; }
						}
						
						if ((aCheck[0]+aCheck[1]+aCheck[2]+aCheck[3])>=3) score += 3;
					}
				}
			}
			break;
			
		case 7: // Magicians' valley
			for (var i=0; i<11; i++) {
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==1) {
						var bIsNearMountain = false;
						var x = i - 1; var y = j; // Left
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==9) bIsNearMountain = true; }
						x = i; y = j + 1; // Right
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==9) bIsNearMountain = true; }
						x = i + 1; y = j; // Top
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==9) bIsNearMountain = true; }
						x = i; y = j - 1; // Bottom
						if (((x>=0)&&(x<11))&&((y>=0)&&(y<11))) { if (_MAP[x][y]==9) bIsNearMountain = true; }
						
						if (bIsNearMountain) score += 3;
					}
				}
			}
			break;
			
		case 8: // Empty site
			break;
			
		case 9: // Terraced house
			var nMax = 0;
			var nMaxRow = 0;
			var nCount = 0;
			for (var i=0; i<11; i++) {
				nCount = 0;
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==2) {
						nCount++;
						if (nCount>nMaxRow) nMaxRow = nCount;
					} else {
						nCount = 0;
					}
				}
				if ((nMaxRow>1)&&(nMaxRow>nMax)) nMax = nMaxRow;
			}
			
			for (var i=0; i<11; i++) {
				nCount = 0;
				for (var j=0; j<11; j++) {
					if (_MAP[i][j]==2) {
						nCount++;
						if (nCount>nMaxRow) nMaxRow = nCount;
					} else {
						nCount = 0;
					}
				}
				if (nMaxRow==nMax) score += nMaxRow * 2;
			}
			break;
			
		case 10: // Odd numbered silos
			for (var i=0; i<11; i++) {
				var bIsFullCol = true;
				for (var j=0; j<11; j++) {
					if ((i % 2) == 1) {
						if (_MAP[j][i]==0) bIsFullCol=false;
					} else {
						bIsFullCol=false;
					}
				}
				if (bIsFullCol) score += 10;
			}
			break;
			
		case 11: // Rich countryside
			for (var i=0; i<11; i++) {
				var aCheck = [0, 0, 0, 0, 0];
				for (var j=0; j<11; j++) {
					if (_MAP[x][y]==1) aCheck[0] = 1;
					if (_MAP[x][y]==2) aCheck[1] = 1;
					if (_MAP[x][y]==3) aCheck[2] = 1;
					if (_MAP[x][y]==4) aCheck[3] = 1;
					if (_MAP[x][y]==9) aCheck[4] = 1;
				}
				
				if ((aCheck[0]+aCheck[1]+aCheck[2]+aCheck[3]+aCheck[4])==5) score += 4;
			}
			break;
	}
	
	if (pos!=99) {
		if (mission==99) {
			_SEASON_SCORE[pos] = score;
		} else {
			_MISSION_SCORE[_SEASON][pos] = score;
		}
	} else {
		console.log("Mission " + pos + " points: " + score);
	}
}
			
// --------------------------- //
// ===== COMMON FUNCTIONS ==== //
// --------------------------- //

function SaveGame() {
	var game_data = {
		map: _MAP,
		element: _ELEMENT,
		season: _SEASON,
		season_score: _SEASON_SCORE,
		time: _TIME_CURRENT,
		mission: _MISSIONS,
		mission_score: _MISSION_SCORE
	}
	
	localStorage.setItem("game-data", JSON.stringify(game_data));	
}
			
function LoadGame() {
	var data = localStorage.getItem("game-data");
	var game_data = JSON.parse(data);
	
	_MAP = game_data.map;
	_ELEMENT = game_data.element;
	ElementDraw();
	
	_SEASON_SCORE = game_data.season_score;
	_SEASON = game_data.season;
	SeasonDraw();
	
	_TIME_CURRENT = game_data.time;
	_MISSIONS = game_data.mission;
	_MISSION_SCORE = game_data.mission_score;
	MissionDraw();
	MissionScoreUpdate();
	
	MapDraw();
	
	AddEvent();
}
			
function NewGame() {
	localStorage.clear();
	_GAME_OVER = false;
	
	document.getElementById("btRotate").style.display = "block";
	document.getElementById("btFlip").style.display = "block";
	
	MapDraw();
	MapClear();	
	
	_SEASON_SCORE = [0, 0, 0, 0, 0];
	_SEASON = 0;
	SeasonDraw();
	
	_MISSIONS = [..._MISSION_INIT];
	_MISSION_SCORE = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	_TIME_CURRENT = 0;
	MissionRandom();
	MissionDraw();
	
	ElementNew();
	
	RemoveEvent();
	AddEvent();
}
			
function EndGame() {
	localStorage.clear();
	_GAME_OVER = true;
	
	document.getElementById("lblCurrentSeason").innerHTML = "<span class='endgame'>Game Over!!!</span>";
	document.getElementById("lblCurrentTime").innerHTML = "0";
	
	document.getElementById("lblMission0Title").style.color = "#000000";
	document.getElementById("lblMission1Title").style.color = "#000000";
	document.getElementById("lblMission2Title").style.color = "#000000";
	document.getElementById("lblMission3Title").style.color = "#000000";
	
	document.getElementById("lblMission0Score").innerHTML = "0 points";
	document.getElementById("lblMission1Score").innerHTML = "0 points";
	document.getElementById("lblMission2Score").innerHTML = "0 points";
	document.getElementById("lblMission3Score").innerHTML = "0 points";
	
	document.getElementById("btRotate").style.display = "none";
	document.getElementById("btFlip").style.display = "none";
	
	document.getElementById("lblElementTime").innerHTML = "";
	ElementClear();
	_ELEMENT =  {
        time: 0,
        type: "",
        shape: [[0,0,0],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    }
	
	ScoreDetail();
}
			
function ScoreDetail() {
	document.getElementById("ScoreDetail").style.display = "block";
	
	var content = "<strong>THANK YOU FOR PLAYING!!!</strong><br><br>";
	
	var nTotalScore = 0;
	for (var i=0; i<5; i++) { nTotalScore += _SEASON_SCORE[i]; }
	content += "<strong>TOTAL SCORE:</strong>&nbsp;&nbsp;<strong style=\"font-size: 200%; color: #5b9bd5;\">" + nTotalScore + "</strong> points<br><br>";
	
	content += "<strong>DETAIL SCORE:</strong><br>";
	content += "<span style=\"color: #538135;\">Spring: <strong>" + _SEASON_SCORE[0] + "</strong> points:</span>&nbsp;&nbsp;<span style=\"font-size: 85%; color: #aaaaaa;\">Mission A: <strong>" + _MISSION_SCORE[0][0] + "</strong> points - Mission B: <strong>" + _MISSION_SCORE[0][1] + "</strong> points</span><br>";
	content += "<span style=\"color: #bf9000;\">Summer: <strong>" + _SEASON_SCORE[1] + "</strong> points:</span>&nbsp;&nbsp;<span style=\"font-size: 85%; color: #aaaaaa;\">Mission B: <strong>" + (_MISSION_SCORE[1][1] - _MISSION_SCORE[0][1]) + "</strong> points - Mission C: <strong>" + (_MISSION_SCORE[1][2] - _MISSION_SCORE[0][2]) + "</strong> points</span><br>";
	content += "<span style=\"color: #c55a11;\">Autumn: <strong>" + _SEASON_SCORE[2] + "</strong> points:</span>&nbsp;&nbsp;<span style=\"font-size: 85%; color: #aaaaaa;\">Mission C: <strong>" + (_MISSION_SCORE[2][2] - _MISSION_SCORE[1][2]) + "</strong> points - Mission D: <strong>" + (_MISSION_SCORE[2][3] - _MISSION_SCORE[1][3]) + "</strong> points</span><br>";
	content += "<span style=\"color: #2e75b5;\">Winter: <strong>" + _SEASON_SCORE[3] + "</strong> points:</span>&nbsp;&nbsp;<span style=\"font-size: 85%; color: #aaaaaa;\">Mission D: <strong>" + (_MISSION_SCORE[3][3] - _MISSION_SCORE[2][3]) + "</strong> points - Mission A: <strong>" + (_MISSION_SCORE[3][0] - _MISSION_SCORE[2][0]) + "</strong> points</span><br>";
	content += "Bonus (Surrounded mountain): <strong>" + _SEASON_SCORE[4] + "</strong> points";
	
	document.getElementById("txtScore").innerHTML = content;
	//console.log(_MISSION_SCORE);
}
			
function ScoreClose() {
	document.getElementById("ScoreDetail").style.display = "none";
}
			
// ========================= //
// ===== DOCUMENT READY ==== //
// ========================= //		

function Test() {
	ScoreCalc(6, 99);
	console.log(_MISSION_SCORE);
}
			
document.addEventListener("DOMContentLoaded", function(e) {
	var data = localStorage.getItem("game-data");
	if (data==null) {
		NewGame();
	} else {
		LoadGame();
	}	
	
	document.getElementById("btNewGame").addEventListener("click", function (e) {
		if (confirm("Do you want to start new game?")==true) { NewGame(); }
	});
	
	document.getElementById("btClose").addEventListener("click", function (e) {
		ScoreClose();
	});	
	
	document.getElementById("btRotate").addEventListener("click", function (e) {
		ElementRotate();
	});
	
	document.getElementById("btFlip").addEventListener("click", function (e) {
		ElementFlip();
	});	
});

function CellClick(e) {
	var aPos = 	e.getAttribute("data").split('|');
	if (_DROP_READY&&!_GAME_OVER) {
		MapElementDrop(aPos);
	}	
}
			
function CellMouseOut(map_cells) {
	map_cells.forEach(function(cell) {
		cell.style.borderColor = "#ffffff";
	});	
}
			
function CellMouseMove(e) {
	var aPos = e.getAttribute("data").split('|')
	var nPos = _MAP[aPos[0]][aPos[1]];
	MapElementCheck(aPos);
}
			
function AddEvent() {
	var map_cells = document.querySelectorAll(".map-cell");
	map_cells.forEach(function(map_cell) {
		map_cell.addEventListener("click", function() {
			CellClick(this);
		});
		
		map_cell.addEventListener("mouseout", function() {
			CellMouseOut(map_cells)		
		});
								  
		map_cell.addEventListener("mouseover", function() {
			CellMouseMove(this);
		});
	});
}
			
function RemoveEvent() {
	var map_cells = document.querySelectorAll(".map-cell");
	map_cells.forEach(function(map_cell) {
		map_cell.removeEventListener("click", function() {
			CellClick(this);
		});
		
		map_cell.removeEventListener("mouseout", function() {
			CellMouseOut(map_cells)		
		});
								  
		map_cell.removeEventListener("mouseover", function() {
			CellMouseMove(this);
		});
	});
}