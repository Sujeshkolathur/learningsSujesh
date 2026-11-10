package DSA;

import java.util.Arrays;

public class MergeSortedArrays {

	public static void main(String[] args) {
		System.out.println(Arrays.toString(merge(new int[]{1,3,5}, new int[]{2,4,6})));

	}

	private static int[]	 merge(int[] arr1, int[] arr2) {
		int length1 = arr1.length;
		int length2 = arr2.length;
		int count1=0;
		int count2 = 0;
		int count3=0;
		int[] mergedArr=new int[length1+length2];
		while(count1<length1 && count2<length2) {
			if(arr1[count1]<arr2[count2]) {
				mergedArr[count3]=arr1[count1];
				count1++;
				count3++;
			}else if(arr1[count1]>=arr2[count2]) {
				mergedArr[count3]=arr2[count2];
				count2++;
				count3++;
			}
		}
		if(count1<length1) {
			for(int i=count1;i<length1;i++) {
				mergedArr[count3]=arr1[count1];
				count1++;
				count3++;
			}
		}
		if(count2<length2) {
			for(int i=count2;i<length2;i++) {
				mergedArr[count3]=arr2[count2];
				count2++;
				count3++;
			}
		}
		
		return mergedArr;
	}

}
