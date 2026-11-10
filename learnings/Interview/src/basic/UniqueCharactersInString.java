package basic;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class UniqueCharactersInString {
	public static void main(String args[]) {
		String string = "sujeh";
		string.toCharArray();
		Set<Integer> charSet = new HashSet();
		string.chars().mapToObj(i->i).forEach(a->charSet.add(a));
		if (string.length() == charSet.size()) {
			System.out.println("unique");

		} else {
			System.out.println("Not unique");
			
		}
		
		System.out.println(charSet.size());
		System.out.println(string.length());
		
		Set<Character> uniqueSet =  new HashSet<>();
		
		String string1="Sujeh";
		string1.chars().mapToObj(c->(char)c).forEach(i->{
			System.out.println(i);
			if(!uniqueSet.add(i)) {
				System.out.println(i+" is duplicate");
			}
		});
		
	}

}
