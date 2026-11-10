package basic;

public class StringRotation {

	public static void main(String[] args) {
		String string1= new String("sujesh");
		String string2= new String("jeshsu");
		StringBuilder builder= new StringBuilder(string1);
		for (int i = 0; i < string1.length(); i++) {
			char lastChar = builder.charAt(0);
			builder.deleteCharAt(0);
			builder.append(lastChar);
			if(string2.equalsIgnoreCase(builder.toString())) {
				System.out.println("rotation match");
			}
		}

	}

}
