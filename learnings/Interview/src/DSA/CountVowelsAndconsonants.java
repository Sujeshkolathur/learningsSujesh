package DSA;

public class CountVowelsAndconsonants {

	public static void main(String[] args) {
		countVC("Java"); // Vowels: 2, Consonants: 2

	}

	private static void countVC(String string) {
		string = string.toLowerCase();
		char[] charArray = string.toCharArray();
		int vowels=0;
		int consonants=0;
		for (char c : charArray) {
			if("aeiou".indexOf(c)!=-1) {
				vowels++;
			}else if(c>='a'&& c<='z') {
				consonants++;
			}
		}
		System.out.println("vowels = "+vowels+"  consonants="+consonants);
		
	}

}
