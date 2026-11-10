package interview.coding1;

public class PalindromChack {

	public static void main(String[] args) {
		String string = "malayalam";
		boolean isPalindrom= isPalindrom(string);
		System.out.println(isPalindrom);

	}

	private static boolean isPalindrom(String string) {
		for(int i=0;i<=(string.length()/2)-1;i++) {
			if(string.charAt(i)!=string.charAt(string.length()-i-1)) {
				return false;
			}
		}
		return true;
	}

}
