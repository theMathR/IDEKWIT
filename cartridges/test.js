if (memory == null) {
	new_rectangle(1,5,10,10,10)
	set_speed(1,20,-10)
	memory = [20, -10]
}
var c = get_collisions(1)[0]
if (c[0] || c[2]) {
	memory[0] = -memory[0]
	set_speed(1, memory[0], memory[1])
}
if (c[1] || c[3]) {
	memory[1] = -memory[1]
	set_speed(1, memory[0], memory[1])
}
