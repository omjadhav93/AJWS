const addAddress = () => {
    document.getElementsByClassName("content")[0].innerHTML = `<form action="/user/address" method="post" id="contactForm"> 
    <div class="box"> 
      <h3>Address </h3>
      <textarea name="address" cols="30" rows="10"> </textarea>
    </div>
    <div class="box"> 
      <h3>Pincode No.</h3>
      <input type="tel" name="pincode" placeholder="Pincode"/>
    </div>
    <button class="btn" type="submit">Submit </button>
  </form>`;
} 