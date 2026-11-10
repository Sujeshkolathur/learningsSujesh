package recursion;

public class Fibanacci {
	public static void main(String[] args) {
		
		int n=10;
		System.out.println(""+fibanacci(n));
		for(int i=0;i<=10;i++) {
			System.out.println((i+1)+"-"+fibanacci(i));
		}
	}

	private static int fibanacci(int n) {
		if(n<=1) {
			return n;
		}
		return fibanacci(n-1)+fibanacci(n-2);
	}

}
