// JavaScript Document

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function MatrixRotate(matrix) {
    let result = [];
    for(let i = 0; i < matrix[0].length; i++) {
        let row = matrix.map(e => e[i]).reverse();
        result.push(row);
    }
    return result;
};

function MatrixFlip(matrix) {
	let result = [];
	result.length = matrix.length;

	result[0] = matrix[2];
	result[1] = matrix[1];
	result[2] = matrix[0];
	
	return result;
};

// Fisher-Yates Sorting Algorithm
function ArrayShuffle(array) { 
	for (let i = array.length - 1; i > 0; i--) { 
		const j = Math.floor(Math.random() * (i + 1)); 
		[array[i], array[j]] = [array[j], array[i]]; 
	} 
	return array; 
};

function ReShape(matrix) {
	var result = matrix.map(function(arr) {
		return arr.slice();
	});
	
	var aIsClear = [true, true, true, true];
	
	for (var i=0; i<3; i++) {
		if (matrix[0][i]>0) aIsClear[0]=false;
		if (matrix[1][i]>0) aIsClear[1]=false;
		if (matrix[i][0]>0) aIsClear[2]=false;
		if (matrix[i][1]>0) aIsClear[3]=false;
	}
		
	if (aIsClear[0]) {
		let temp = [...result];		
		if (aIsClear[1]) {
			result[0] = temp[2];
			result[1] = [0,0,0];
			result[2] = [0,0,0];
		} else {
			result[0] = temp[1];
			result[1] = temp[2];
			result[2] = [0,0,0];
		}
	}
	
	if (aIsClear[2]) {
		let temp = [...result];
		if (aIsClear[3]) {
			for (var i=0; i<3; i++) {
				result[i][0] = temp[i][2];
				result[i][1] = 0;
				result[i][2] = 0;
			}
		} else {
			for (var i=0; i<3; i++) {
				result[i][0] = temp[i][1];
				result[i][1] = temp[i][2];
				result[i][2] = 0;
			}
		}
	}
	
	return result;
}