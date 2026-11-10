package interview.coding1;

public class MaxroductSubarray {

	public static void main(String[] args) {
		int[] arr = { 2, 3, -2, 4 };
		int maxProduct = arr[0];
		int minProduct = arr[0];
		int result = arr[0];
		for (int i = 1; i < arr.length; i++) {
	 

			if (arr[i] < 0) {
				int temp = maxProduct;
				maxProduct = minProduct;
				minProduct = temp;

			}
			maxProduct = Math.max(maxProduct * arr[i], arr[i]);
			minProduct = Math.min(minProduct * arr[i], arr[i]);
			result = Math.max(maxProduct, result);
		}
		System.out.println(result);


	}

}
