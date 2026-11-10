package datastructure;

public class Stack {
	
	int capacity;
	
	Stack(int capacity){
		this.capacity=capacity;
	}
	
	int[] stack = new int[capacity];
	int top=-1;
	public void push(int data) throws Exception {
		if(top==capacity-1) {
			throw new Exception("Stack is full");
		}
		top++;
		stack[top]=data;
	}
	
	public int pop() throws Exception {
		if(top==-1) {
			throw new Exception("Stack is empty");
		}
		int data=stack[top];
		top--;
		return data;
	}
	public void show() {
		for(int i=top;i>=0;i--) {
			System.out.println(stack[i]);
		}
	}
	
	
	

	public static void main(String[] args) throws Exception {
		Stack stack = new Stack(5);
		stack.push(0);
//		stack.push(1);
//		stack.push(2);
//		stack.push(3);
//		stack.push(4);
		stack.pop();
		stack.pop();
		stack.show();
		//stack.push(5);
		

	}

}
