package basic;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Anagram {
	public static void main(String[] args) {
		String string1 = "sujesh";
		String string2 ="sushje";
		IntStream chars = string1.chars();
		String sorted1 = string1.chars().sorted().mapToObj(c->String.valueOf(c)).collect(Collectors.joining());
		
		String sorted2 = string2.chars().sorted().mapToObj(c->String.valueOf(c)).collect(Collectors.joining());

		System.out.println(sorted2);
		System.out.println(sorted1);

		if(sorted1.equalsIgnoreCase(sorted2)) {
			System.out.println("anagram");
		}
	}

}
