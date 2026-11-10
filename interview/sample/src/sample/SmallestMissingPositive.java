package sample;

public class SmallestMissingPositive {

	public static void main(String[] args) {
		int[] arr = {7,2,4,5,-1,1};
		int missingNumber = findNumber(arr);
		System.out.println(missingNumber );
	}

	private static int findNumber(int[] arr) {
		for (int i = 0; i < arr.length; i++) {
			if(arr[i]>0&&arr[i]<=arr.length&&arr[i]!=arr[arr[i]-1]) {
				int correctIndex = arr[i]-1;
				int temp= arr[i];
				arr[i] =  arr[correctIndex];
				arr[correctIndex] = temp;
			}
			
		}
		for (int i = 0; i < arr.length; i++) {
			if(arr[i] != i+1) {
				return i+1;
			}
			
		}
		return 0;
	}

}
