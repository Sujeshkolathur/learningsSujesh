package sample;

public class SecondLargestWithoutSorting {

	public static void main(String[] args) {
		int[] arr = new int[] {1,2,3,5,6,7,8,9,11,10,3,2,1,4,5,6,7};
		int largest =  Integer.MIN_VALUE;
		int secondLargest =  Integer.MIN_VALUE;
		for (int i = 0; i < arr.length; i++) {
			if(arr[i]>largest) {
				secondLargest=largest;
				largest=arr[i];
			}else  {
				secondLargest=Math.max(secondLargest, arr[i]);
			}
			
		}
		System.out.println(secondLargest);

	}

}
