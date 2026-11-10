package DSA;

import java.util.HashMap;
import java.util.Map;

public class TwoSumTarget {

	public static void main(String[] args) {
		int[] intArray= new int[] {1,2,3,4,5,6,7,89,9,9};
		int[] theTwoSumTarget = findTheTwoSumTarget(intArray,10);
		System.out.println("index "+theTwoSumTarget[0]+" "+ theTwoSumTarget[1]);
 
	}

	private static int[] findTheTwoSumTarget(int[] intArray, int target) {
		Map<Integer, Integer> numbersMap = new HashMap<>();
		for (int j = 0; j < intArray.length; j++) {
			int i = intArray[j];
			int secondnumber = target-i;
			if(numbersMap.containsKey(secondnumber)) {
				return new int[] {j,numbersMap.get(secondnumber)};
			}else {
				numbersMap.put(i, j);
			}
			
		}
		return null;
		
	}

}
