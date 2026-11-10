package basic;

public class ReverseString {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String string = new String("Sujesh");
		String result="";
		for(int i=string.length()-1;i>=0;i--) {
			result= result+string.charAt(i);
		}
		System.out.println(result);
		StringBuilder reverse = new StringBuilder(result).reverse();
		System.out.println(reverse);
		
		
		
		
		char[] charArray = string.toCharArray();
		for(int i=0,j=charArray.length-1;i<charArray.length;i++,j--) {
			char temp=charArray[i];
			charArray[i]=charArray[j];
			charArray[j]=charArray[temp];
		}
		System.out.println(charArray);
	}

}
