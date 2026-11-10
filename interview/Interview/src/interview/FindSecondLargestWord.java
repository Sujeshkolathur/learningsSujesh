package interview;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

public class FindSecondLargestWord {

	public static void main(String[] args) {
		String word="the quick brownlllll fox jumccccpsoooooo ovecccr the lazy dog";
		System.out.println(findSecondLargestWord(word));
		System.out.println(findSecondLargestWord("the quick brown fox jumps over the lazy dog"));

	}

	private static String findSecondLargestWord(String word) {
		String[] words=word.split(" ");
		Arrays.stream(words).sorted((s1,s2)->s2.length()-s1.length()).skip(1).findFirst();
		return Arrays.stream(words).sorted((s1,s2)->s2.length()-s1.length()).skip(1).findFirst().get();
	}

}
