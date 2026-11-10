package interview.coding1;

import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class LongestSubString {

	public static void main(String[] args) {

		String word = "susjesh";
		int firstIndex=0;//will store the first index of the substring
		int maxLength = 0;//will store the longest substring length
		Set<Character> chars = new HashSet<>();//used to store the characters
		for(int i=0;i<word.length();i++) {//travers through entire string
			while(chars.contains(word.charAt(i))) {//check if the current char is already there
				chars.remove(word.charAt(firstIndex));//romove the character till the first occurance
				firstIndex++;
			}
			chars.add(word.charAt(i));//add unique chars in set
			maxLength=Math.max(maxLength, i-firstIndex+1);//find max length
		}
		System.out.println(maxLength);

	}

}
