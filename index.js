const FPS = 30
const BATTERY_RATE = 1/90
const documentation = "https://github.com/theMathR/IDEKWIT"

const image = new Image()
image.src = 'assets/console.png'

const button_spr = [new Image(), new Image(), new Image(), new Image()]
button_spr[0].src = 'assets/button.png'
button_spr[1].src = 'assets/button2.png'
button_spr[2].src = 'assets/button3.png'
button_spr[3].src = 'assets/help.png'

const charger = new Image()
charger.src = 'assets/charger.png'

const dragndrop = new Image()
dragndrop.src = 'assets/dragndrop.png'

const error_spr = new Image()
error_spr.src = 'assets/error.png'

const cartridge_spr = [new Image(), new Image()]
cartridge_spr[0].src = 'assets/cartridge.png'
cartridge_spr[1].src = 'assets/cartridge2.png'

var pixel = 0

var buttons = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
var screen = [0,0,0,0]

var clear_screen_ = false
var new_screen_data = {}
var screen_data = {}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var frame = 0
var lpo = Infinity
var charger_anim = 0
var bframe = 0

var m = false
var input_data = {pressed:false, x:0, y:0, newx: 0, newy: 0}
var input = 0

var on = false
var battery = 100
var charging = false

var input_file = 0

var cartridge = 0
var error = false
var cartridge_error = false

var memory = null
var cartridges = [1, 1, 1, 1, 1, 1]
var cartridges_data = {1:()=>{},2:()=>{},3:()=>{},4:()=>{},5:()=>{},6:()=>{}}


function update() {

	screen_data = new_screen_data
	if (clear_screen_) screen_data = new_screen_data = {}
	clear_screen_ = false
	
	for (let [id, data] of Object.entries(new_screen_data)) {
		if (data[4] < 100) data[4] += 20
		data[0] += data[5]/30
		data[1] += data[6]/30
		data[0] = Math.min(Math.max(0, data[0]), 134-data[2])
		data[1] = Math.min(Math.max(0, data[1]), 101-data[3])
		screen_data[id] = data
	}
	
	new_screen_data = screen_data
	
	if ((frame - bframe) % 10 && on) {
		input = 0
		if (input_data.pressed) {
			input = 1
			if ((input_data.x - input_data.newx)**2 + (input_data.y - input_data.newy)**2 > 50) {
				input = Math.atan((input_data.newy - input_data.y)/(input_data.newx - input_data.x))
				input = -Math.round(input/Math.PI*4)
				if ((input_data.newx - input_data.x) < 0) input += 4
				else if ((input_data.newy - input_data.y) > 0) input += 8
				input = (input % 8) + 2
			}
		}
		input_data.x = input_data.newx
		input_data.y = input_data.newy
		if (cartridge) {
			if (cartridges[cartridge-1] == 0) {
				try {
					cartridges_data[cartridge](clear_screen, new_rectangle, set_speed, remove_rectangle, get_collisions, (t) => {console.log("LOG: ", t)})
				} catch(err) {
					console.log("ERROR", err)
					set_cartridge(0)
					error = true
				}
			} else {
				set_cartridge(0)
				error = true
			}
		} else {
			if (error) {
				if (memory == null) {
					new_rectangle(0, 62, 5, 10, 65)
					new_rectangle(1, 62, 80, 10, 10)
					memory = true
				}
			} else {
				cartridges.forEach((x, i) => {
					if (x==0) {
						let mx = (i%3 + 0.5) * 134/3-2.5
						let my = i<3?101/4:101*3/4-2.5
						switch(i) {
							case 0:
								new_rectangle(4, mx, my, 5, 5)
								break
							case 1:
								new_rectangle(5, mx+7.5, my+7.5, 5, 5)
								new_rectangle(6, mx-7.5, my-7.5, 5, 5)
								break
							case 2:
								new_rectangle(7, mx+7.5, my-7.5, 5, 5)
								new_rectangle(8, mx, my, 5, 5)
								new_rectangle(9, mx-7.5, my+7.5, 5, 5)
								break
							case 3:
								new_rectangle(10, mx+7.5, my+7.5, 5, 5)
								new_rectangle(11, mx-7.5, my-7.5, 5, 5)
								new_rectangle(12, mx+7.5, my-7.5, 5, 5)
								new_rectangle(13, mx-7.5, my+7.5, 5, 5)
								break
							case 4:
								new_rectangle(14, mx+7.5, my+7.5, 5, 5)
								new_rectangle(15, mx-7.5, my-7.5, 5, 5)
								new_rectangle(16, mx+7.5, my-7.5, 5, 5)
								new_rectangle(17, mx, my, 5, 5)
								new_rectangle(18, mx-7.5, my+7.5, 5, 5)
								break
							case 5:
								new_rectangle(19, mx+7.5, my+7.5, 5, 5)
								new_rectangle(20, mx-7.5, my-7.5, 5, 5)
								new_rectangle(21, mx+7.5, my-7.5, 5, 5)
								new_rectangle(22, mx-7.5, my+7.5, 5, 5)
								new_rectangle(23, mx, my-7.5, 5, 5)
								new_rectangle(24, mx, my+7.5, 5, 5)
								break
						}
					} else {
						switch(i) {
							case 0:
								remove_rectangle(4)
								break
							case 1:
								remove_rectangle(5)
								remove_rectangle(6)
								break
							case 2:
								remove_rectangle(7)
								remove_rectangle(8)
								remove_rectangle(9)
								break
							case 3:
								remove_rectangle(10)
								remove_rectangle(11)
								remove_rectangle(12)
								remove_rectangle(13)
								break
							case 4:
								remove_rectangle(14)
								remove_rectangle(15)
								remove_rectangle(16)
								remove_rectangle(17)
								remove_rectangle(18)
								break
							case 5:
								remove_rectangle(19)
								remove_rectangle(20)
								remove_rectangle(21)
								remove_rectangle(22)
								remove_rectangle(23)
								remove_rectangle(24)
								break
						}
					}
				})
				
				let u = false
				if (memory == null) {
					u = true
					memory = [0, false, false, false]
				}
				if (input == 2 && !memory[1]) {
					u = true
					memory[0]++
				}
				if (input == 6 && !memory[1]) {
					u = true
					memory[0]--
				}
				if (input == 8 && !memory[1] && memory[0] < 3) {
					u = true
					memory[0] += 3
				}
				if (input == 4 && !memory[1] && memory[0] > 2) {
					u = true
					memory[0] -= 3
				}
				if (input > 1) memory[1] = memory[3] = true
				else memory[1] = false
				memory[0] = Math.min(Math.max(0, memory[0]), 5)
				
				if (u) {
					remove_rectangle(0)
					new_rectangle(0,(memory[0]%3 + 0.5) * 134/3 - 2.5 - 15, memory[0]<3?101/4:101*3/4 - 2.5, 5,5)
				}

				if (input == 1) memory[2] = true

				if (input == 0) {
					if (memory[2] && !memory[3]) {
						set_cartridge(1+memory[0])
					} else {
						memory[2] = memory[3] = false
					}
				}
			}
		}
	}

	if (frame - lpo > 60) {
		on = battery && !on
		set_cartridge(0)
		lpo=Infinity
	}
	
	if (Math.floor(frame / 10) % 2) {
		buttons[7] = [(canvas.width-pixel*10)/2, canvas.height*0.96, pixel*10, pixel*10]
	} else {
		buttons[7] = [(canvas.width-pixel*12)/2, canvas.height*0.96-pixel, pixel*12, pixel*12]
	}
	
	for (let i=0;i<6;i++) {
		let x = cartridges[i]
		if (x < 0) {
			cartridges[i] -= 3
			if (cartridges[i] <= -100) cartridges[i] = 1
		} else if (x > 1) {
			cartridges[i] += 3
			if (cartridges[i] >= 101) cartridges[i] = 0
		}
		
	}
	
	if (charger_anim) {
		charger_anim -= 0.01
		if (charger_anim <= 0.95) {
			charger_anim = 0
			charging = true
		}
	}
	
	if (on) battery = Math.max(battery - BATTERY_RATE, 0)
	if (charging) battery = Math.min(battery + BATTERY_RATE * 1.5, 100)
	if (!battery) on = false
	
	frame++
}

function draw() {
	ctx.fillStyle = 'beige'
	ctx.fillRect(0, 0, screen[0], canvas.height)
	ctx.fillRect(screen[0]+screen[2], 0, screen[0], canvas.height)
	ctx.fillRect(screen[0], canvas.height*0.95, screen[2], canvas.height*0.05)
	
	ctx.imageSmoothingEnabled = false;
	
	// Draw buttons and cartridges
	cartridges.forEach((x, i) => {
		// Cartridges
		if (x == 0) {
			ctx.drawImage(cartridge_spr[i<3?1:0], (canvas.width+(i<3?-160:41) * pixel)/2, buttons[i][1]-pixel*2, pixel*60, pixel*19)
		} else if (x > 1) {
			if (i<3) {
				ctx.drawImage(cartridge_spr[1], ((canvas.width-160 * pixel)/2 + pixel*60) * (x-1)/100 - pixel*60, buttons[i][1]-pixel*2, pixel*60, pixel*19)
			} else {
				ctx.drawImage(cartridge_spr[0], canvas.width - ((canvas.width-pixel*41)/2) * (x-1)/100, buttons[i][1]-pixel*2, pixel*60, pixel*19)
			}
		} else if (x < 0) {
			if (i<3) {
				ctx.drawImage(cartridge_spr[1], ((canvas.width-160 * pixel)/2 + pixel*60) * (1+(x)/100) - pixel*60, buttons[i][1]-pixel*2, pixel*60, pixel*19)
			} else {
				ctx.drawImage(cartridge_spr[0], canvas.width - ((canvas.width-pixel*41)/2) * (100+x)/100, buttons[i][1]-pixel*2, pixel*60, pixel*19)
			}
		}
		
		// Buttons
		if (x != 0 && x != 1) return
		ctx.drawImage(button_spr[(i<3^x)?1:0], buttons[i][0], buttons[i][1], pixel*15, pixel*15)
	})
	
	// Draw other buttons
	if (battery<16 && !charging) ctx.drawImage(button_spr[2], buttons[7][0], buttons[7][1], buttons[7][2], buttons[7][3])
	ctx.drawImage(button_spr[3], 0, 0, pixel*15, pixel*15)
	
	// Draw charger
	if (charging) {
		ctx.drawImage(charger, (canvas.width-pixel*14)/2, canvas.height*0.95-pixel*4, pixel*14, pixel*48)
	} else if (charger_anim) {
		ctx.drawImage(charger, (canvas.width-pixel*14)/2, canvas.height*charger_anim - pixel*4, pixel*14, pixel*48)
	}
	
	// Draw console
	ctx.drawImage(image, (canvas.width-pixel*150)/2, 0, pixel*150, canvas.height*0.95)
	ctx.fillStyle = 'white'
	ctx.globalAlpha = 0.4
	ctx.fillRect(screen[0], screen[1], screen[2], screen[3])
	ctx.globalAlpha = 1
	
	// On/off button
	ctx.fillStyle = '#1f1f1f'
	if (on) {
		if (!charging) {
			ctx.fillStyle = 'rgb(' + ((100-battery)/100*255).toString() + ',' + (battery/100*255).toString() + ',0)'
			if (Math.floor(frame / 5) % 2 && battery < 6) ctx.fillStyle = '#1f1f1f'
		} else {
			ctx.fillStyle = 'rgb(0,' + (battery/100*255).toString() + ',' + ((100-battery)/100*255).toString() + ')'
		}
	}
	ctx.fillRect(buttons[8][0] + pixel, buttons[8][1] + pixel, buttons[8][2] - pixel, buttons[8][3] - pixel)
	
	// Screen
	ctx.fillStyle = 'black'
	Object.values(screen_data).forEach((x) => {
		ctx.globalAlpha = x[4]/100
		ctx.fillRect(screen[0]+x[0]*pixel, screen[1]+x[1]*pixel, x[2]*pixel, x[3]*pixel)
	})
	ctx.globalAlpha = 1
	
	// Drag&Drop Window
	if (input_file) {
		ctx.drawImage(dragndrop, (canvas.width-pixel*250)/2, (canvas.height-pixel*250)/2, pixel*250, pixel*250)
	}
	// Cartridge error window
	if (cartridge_error) {
		ctx.drawImage(error_spr, (canvas.width-pixel*250)/2, (canvas.height-pixel*250)/2, pixel*250, pixel*250)
	}
}


function clear_screen() {
	clear_screen_ = true
}

function new_rectangle(id, x, y, w, h) {
	if (Object.keys(new_screen_data).includes(id.toString())) return
	new_screen_data[id] = [Math.min(Math.max(0,x),134-w), Math.min(101-h, Math.max(0,y)), w, h, 0, 0, 0]
}

function set_speed(id, x, y) {
	if (!Object.keys(new_screen_data).includes(id.toString())) return
	new_screen_data[id][5] = x
	new_screen_data[id][6] = y
}

function remove_rectangle(id) {
	if (!Object.keys(new_screen_data).includes(id.toString())) return
	delete new_screen_data[id]
}

function get_collisions(id) {
	if (!Object.keys(new_screen_data).includes(id.toString())) return
	var r = new_screen_data[id]
	var collisions = [[r[0] == 0, r[1] == 0, r[0] + r[2] == 134, r[1] + r[3] == 101]]
	Object.entries(new_screen_data).forEach((x) => {
		if (x[0] == id) return
		var r2 = x[1]
		if (r[0] + r[2] >= r2[0] && r[0] <= r2[0] + r2[2] && r[1] + r[3] >= r2[1] && r[1] <= r2[1] + r2[3]) collisions.push(parseInt(x[0]))
		
	})
	return collisions
}

function set_cartridge(x) {
	clear_screen()
	error = false
	cartridge = x
	memory = null
	bframe = (frame+1) % 10
}


function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	pixel = canvas.height*0.95/250
	
	for(let i=0;i<6;i++) {
		buttons[i] = [(i<3 ? -1 : 1) * pixel*100 + (canvas.width - pixel*15)/2, 25*pixel*(6+i%3), 
			pixel*15, pixel*15]
	}
	
	buttons[6] = [0,0,pixel*15,pixel*15]
	buttons[7] = [(canvas.width-pixel*10)/2, canvas.height*0.96, pixel*10, pixel*10]
	buttons[8] = [(canvas.width-pixel*150)/2+pixel*65,pixel*8,pixel*19,pixel*5]
	buttons[9] = [(canvas.width-pixel*134)/2, pixel*130, pixel*134, pixel*101]
	
	screen = [(canvas.width-pixel*134)/2, pixel*19, pixel*134, pixel*101]
	
	draw()
}

function onClick(e) {
	input_file = 0
	cartridge_error = false

	let b = -1 
	buttons.forEach((x, i) => {
		if (x[0] < e.clientX && e.clientX < x[0] + x[2] && x[1] < e.clientY && e.clientY < x[1] + x[3]) b=i
	})
	
	if (b < 6) {
		if (cartridges[b] == 0) {
			cartridges[b] = -1
			cartridges_data[b+1]=()=>{}
		}
		else if (cartridges[b] == 1) input_file = b + 1
	}
	if (b == 6) window.open(documentation)
	if (b == 7) charger_anim = 1
	if (b == 8 && (cartridge != 0 || error)) set_cartridge(0)
	m = false
	if (b==9) input_data.pressed = false
	lpo = Infinity
}

function onMouseDown(e) {
	let b = -1 
	buttons.forEach((x, i) => {
		if (x[0] < e.clientX && e.clientX < x[0] + x[2] && x[1] < e.clientY && e.clientY < x[1] + x[3]) b=i
	})
	
	if (b==8) lpo = frame
	m = true
	if (b==9) {
		input_data.pressed = true
		input_data.x = e.clientX
		input_data.y = e.clientY
		input_data.newx = input_data.x
		input_data.newy = input_data.y
	}
}

function onMouseMove(e) {
	if (buttons[9][0] < e.clientX && e.clientX < buttons[9][0] + buttons[9][2] && buttons[9][1] < e.clientY && e.clientY < buttons[9][1] + buttons[9][3]) {
		if (input_data.pressed && m) {
			input_data.newx = e.clientX
			input_data.newy = e.clientY	
		} else if (m) {
			input_data.pressed = true
			input_data.x = e.clientX
			input_data.y = e.clientY
			input_data.newx = input_data.x
			input_data.newy = input_data.y
		} else {
			input_data.pressed = false
		}
	} else {
		input_data.pressed = false
	}
}

function drop(e) {	
	if (input_file) {
		e.dataTransfer.files[0].text().then(text => {
			text = text.replaceAll(/\/\*.*\*\//gs, '\n').replaceAll(/\/\/.*\n/g, '\n')
			var brackets = 0
			text.split('').forEach((x) => {
				if (brackets<0) return
				if (x=='{') brackets+=1
				else if (x=='}') brackets-=1
			})
			if (brackets != 0 || /([\"\'])|(\.(?![\d "includes" "length"]))|((?!["includes" "length" "var" "log" "if" "else" "memory" "clear_screen" "new_rectangle" "set_speed" "remove_rectangle" "get_collisions" "null" "switch" "case" "break" "undefined" "true" "false" "input"])([a-zA-Z]{2,}))/.test(text)) {
				console.log("CARTRIDGE IS INVALID IDKEWITSCRIPT")
				cartridge_error = true
			} else {
			
			try {
				cartridges_data[input_file] = eval('(clear_screen, new_rectangle, set_speed, remove_rectangle, get_collisions, log) => {' + text + '}')
				cartridges[input_file-1] = 2
			} catch (e) {
				console.log("CARTRIDGE ERROR", e)
				cartridge_error = true
			}
		}input_file = 0})
	}
}


resizeCanvas()
setInterval(() => {
	update()
	draw()
}, 1000/FPS)
