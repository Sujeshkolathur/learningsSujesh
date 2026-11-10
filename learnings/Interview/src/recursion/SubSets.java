package recursion;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class SubSets {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		List<Integer> set= new ArrayList<>();
		set.add(10);
		set.add(3);
		List<List<Integer>> powerSet= new ArrayList<>();
		powerSet=findPowerSet(set, powerSet,0,new ArrayList());
		powerSet.forEach(i->{
			System.out.println("{");
			i.forEach(j->System.out.println(j+","));
			System.out.println("}");
		});
				
	}

	private static List<List<Integer>> findPowerSet(List<Integer> set, List<List<Integer>> powerSet, int i,
			ArrayList current) {		
		powerSet.add(new ArrayList<>(current));
		for (int j = i; j < set.size(); j++) {
			current.add(set.get(j));
			findPowerSet(set, powerSet, i+1, current);
			current.remove(current.size()-1);
			
		}
		
		
		
		return powerSet;
	}

}
