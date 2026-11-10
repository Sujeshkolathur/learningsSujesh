package stream;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamQustions {

	public static void main(String[] args) {
		List<Integer> numbers= List.of(1, 2, 5, 1009, 2);
		Integer reduce = numbers.stream().reduce(0, (a,b)->a+b);
		System.out.println("sum using reduce="+reduce);
		System.out.println("Max of number="+numbers.stream().max((a,b)->a-b));
		System.out.println("productOf all numbers= "+numbers.stream().reduce(1, (a,b)->a*b));

		
		
		List<String> strings = new ArrayList<>(List.of("Sujekh", "rajan")) ;
		
		System.out.println("Concatenate Strigs="+ strings.stream().collect(Collectors.joining()));
		System.out.println("Concatenate Strigs using reduce = "+ strings.stream().reduce("",(a,b)->a+b));
		
		System.out.println("Sum of squeres= "+numbers.stream().map(a->a*a).reduce(0, (a,b)->a+b));
		System.out.println("Longest String is "+strings.stream().max((a,b)->a.length()-b.length()));
		String string = new String("sujesh");
		System.out.println("number of characters= "+string.chars().mapToObj(a->(char)a).collect(Collectors.groupingByConcurrent(Function.identity(), Collectors.counting())));
		List<Integer> numbersList = new ArrayList<>();
		numbersList.addAll(List.of(1,4,2,7,9));
		
		numbersList.stream().forEach(System.out::println);
		//numbersList.sort(Comparator.naturalOrder());
		//System.out.println("sorted using list.sort="+numbersList);
		
//		List<Integer> sortedList = numbersList.stream().sorted(Comparator.reverseOrder()).toList();
//		System.out.println("sorted using stream.sort in reverse order="+sortedList);
		
//		List<Integer> sortedList = numbersList.stream().sorted(Comparator.naturalOrder()).toList();
//		System.out.println("sorted using stream.sort in natural order="+sortedList);
		
//		List<Integer> sortedList = numbersList.stream().sorted().toList();
//		System.out.println("sorted using stream.sort ="+sortedList);
		
		List<Integer> sortedList = numbersList.stream().sorted(Comparator.comparingInt(a->a)).toList();
		System.out.println("sorted using stream.sort ="+sortedList);

	}

}
