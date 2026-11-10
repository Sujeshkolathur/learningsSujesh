package recursion;

public class Reccursion {
	
	public static void main(String [] args) {
		int num =10;
		Long factorial= factorial(54);
		System.out.println("factorial="+factorial);
	}

	private static Long factorial(int i) {
		if (i==1)
			return 1L;
		
		return i*factorial(i-1);
	}

}
