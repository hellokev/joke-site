export const Main = () => { 
    return ( 
    <div>
          <h1>Jokes!</h1>
        <p>Welcome to my joke website</p>
        <h2>Terms</h2>
        <p>We require an age check to determin what types of jokes you will be able to view.
            Thank you!</p>
        <div class="form-group">
            <label for="flavorShot">Age Requirement</label>
                <select id="age-check" class="form-control" name="age">
                <option value="">None</option>
                <option value="yonger-18">Yonger then 18</option>
                <option value="older-18">Older then 18</option>
                </select>
                <div>
                    <button type="submit" class="btn btn-default">Submit</button>
                </div>
        </div>
    </div>
    )
}