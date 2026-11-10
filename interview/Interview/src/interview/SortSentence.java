package interview;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class SortSentence {

	public static void main(String[] args) {
		List<String> sentences = List.of("Lambda expressions rock",
		"Java is awesome",
		"Hello world",
		"Streams are powerful in Java",
		"Hi");
		Comparator<String> lengthComparator =(a1,a2)->a1.split(" ").length-a2.split(" ").length;  
		Comparator<String> naturalOrderComparator =(a1,a2)->a1.compareTo(a2);  

		sentences.stream().sorted(lengthComparator.thenComparing(naturalOrderComparator)).forEach(a->System.out.println(a));

	}

}
