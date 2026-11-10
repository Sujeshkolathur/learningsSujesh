package sample;

public class MoveZorosToEnd {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] arr = new int[] {1,2,3,0,-6,-80,0,-50,1,1,12,0,3};
		int index = 0;
		for (int i = 0; i < arr.length; i++) {
			if(arr[i]!=0 ) {
				
				int temp= arr[i];
				arr[i]=arr[index];
				arr[index]=temp;
				index++;
						
			}
			
		}
		for (int i = 0; i < arr.length; i++) {
			System.out.println(arr[i]);
			
		}
	}

}
