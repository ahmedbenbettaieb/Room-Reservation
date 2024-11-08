<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Update</title>
</head>
<body>
    <h1>Event - {{ $title }} - Updated</h1>
    <p>Hello,</p>
    <p>You have been invited to participate in the following event:</p>
    <ul>
        <li><strong>Start Date:</strong> {{ $start_date }}</li>
        <li><strong>End Date:</strong> {{ $end_date }}</li>
        <li><strong> Room:  </strong>    {{ $room }}</li>
    </ul>
    <p>We hope to see you there!</p>
</body>
</html>
