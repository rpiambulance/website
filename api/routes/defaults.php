<?php
    function route($get, $post) {
        $connection = connectDB();
        $statement = $connection->prepare("SELECT * FROM default_crews");
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
