if (memory == null) {
	new_rectangle(1,134/2,101/2,5,5)
	new_rectangle(2,20,0,5,25)
	new_rectangle(3,134-25,10,5,25)
	set_speed(1,25,-15)
	memory = [25, -15, 2, 101/2]
}
var c = get_collisions(1)

if (memory[2] == 1) {
	if (input == 4) {
		set_speed(2, 0, -100)
	} else if (input == 8) {
		set_speed(2, 0, 100)
	} else {
		set_speed(2, 0, 0)
	}
} else {
	if (input == 4) {
		set_speed(3, 0, -100)
	} else if (input == 8) {
		set_speed(3, 0, 100)
	} else {
		set_speed(3, 0, 0)
	}
}

memory[3] = memory[3] + memory[1]/30

if (c.includes(3) || c.includes(2)) {
	memory[0] = -memory[0]
	remove_rectangle(1)
	new_rectangle(1,c.includes(2)?25:104,memory[3],5,5)
	set_speed(1, memory[0], memory[1])
	set_speed(memory[2]+1, 0, 0)
	memory[2] = memory[2]==1?2:1
}

if (c[0][1] || c[0][3]) {
	memory[1] = -memory[1]
	set_speed(1, memory[0], memory[1])
}
if (c[0][0] || c[0][2]) {
	clear_screen()
	memory = null
}
