# read_state_diagram.py
# Reads a state diagram specification file and creates a dictionary of states and a dictionary of transitions.
# Here are examples of valid lines in the state diagram file

# 	# This line defines A as a state
#	A
#	# This line says that A can be an entry state
#	->A
#	# This line says that A can transition to B unconditionally
# 	A->B
#	# This line says that A can transition to C if the user's name is greater than 'Trevor'
#	A->C:>Trevor
import sys

def read_state_diagram(input_filename):
	valid_states = {}
	valid_transitions = {}

	# Read the input file

	for line in open(input_filename):
		line = line.strip('\n')
		# check for comments - begin with # character.
		split_line = line.split('#')
		
		text = split_line[0]
		if text == '':
			continue

		# split text into src->dst pairs
		split_text = text.split('->')
		src_state = split_text[0]
		dst_state = ''

		if src_state not in valid_states:
			valid_states[src_state] = True;

		if src_state not in valid_transitions:
			valid_transitions[src_state] = {}

		# Denotes state with no transition
		if len(split_text) == 1:
			continue

		# check for a conditional
		condition_check = split_text[1].split(':')
		dst_state = condition_check[0]

		if dst_state not in valid_states:
			valid_states[dst_state] = True;

		# Grab the condition if there is one. Otherwise it is just marked as true
		condition = True
		if len(condition_check) > 1:
			condition = condition_check[1]

		valid_transitions[src_state][dst_state] = condition

	return valid_states, valid_transitions

if __name__ == '__main__':
	states, transitions = read_state_diagram(sys.argv[1])
	print('- States -')
	print(states)
	print('- Transitions -')
	print(transitions)




