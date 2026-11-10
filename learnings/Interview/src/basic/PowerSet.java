package basic;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class PowerSet {

	public static void main(String[] args) {
		
		List<Integer> set = new ArrayList<>();
		set.add(10);
		set.add(3);
		List<List<Integer>> powerSet = new LinkedList<>();
		powerSet = generatePowerSet(set, new ArrayList<>(), 0, powerSet);
		
		powerSet.forEach(subset -> {
			System.out.print("{ ");
			subset.forEach(element -> System.out.print(element + " "));
			System.out.println("}");
		});
		
	}

	private static List<List<Integer>> generatePowerSet(List<Integer> set, ArrayList current, int index, List<List<Integer>> powerSet) {
		// TODO Auto-generated method stub
		powerSet.add(new ArrayList<>(current));

		for(int i=index;i<set.size();i++) {
			current.add(set.get(i));
			generatePowerSet(set, current, i + 1, powerSet);
			current.remove(current.size() - 1);
		}
		return powerSet;
		
	}

}
